import axios from 'axios';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';
import NodeRSA from 'node-rsa';

import { ModuleSessionInfo } from '@graphql-modules/core';
import { Inject, Injectable, ProviderScope } from '@graphql-modules/di';

import { User } from '../../database/db';
import { expiration, secret } from '../../env';
import { validateLength, validatePassword } from '../../validators';
import { Users } from './users.provider';

@Injectable({
  scope: ProviderScope.Session,
})
export class Auth {
  @Inject() private users: Users;
  @Inject() private module: ModuleSessionInfo;
  private _currentUser: User;

  private get req(): Request {
    return this.module.session.req || this.module.session.request;
  }

  private get res(): Response {
    return this.module.session.res;
  }

  async signIn({ email, password }: { email: string; password: string }): Promise<User> {
    const user = await this.users.findByEmail(email.toLowerCase());

    if (!user) {
      throw new Error('email: Email not found');
    }

    const passwordsMatch = bcrypt.compareSync(password, user.password);

    if (!passwordsMatch) {
      throw new Error('password: Incorrect password');
    }

    const authToken = jwt.sign(email.toLowerCase(), secret);

    if (process.env.NODE_ENV === 'production') {
      this.res.cookie('authToken', authToken, {
        maxAge: expiration,
        secure: true,
        sameSite: 'none',
        domain: '.guidelyte.dev',
      });
    } else {
      this.res.cookie('authToken', authToken, {
        maxAge: expiration,
      });
    }

    return user;
  }

  async signUp({
    name,
    email,
    password,
    passwordConfirm,
  }: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<User | null> {
    const lowerCaseEmail = email.toLowerCase();
    validateLength('name', name, 3, 50);
    validateLength('email', email, 3, 50);
    validatePassword('password', password, passwordConfirm);

    const existingUser = await this.users.findByEmail(lowerCaseEmail);

    if (existingUser) {
      throw Error('email: Email already exists');
    }

    const user = await this.users.newUser({ name, email, password });

    // For some reason, finding a user by email while calling signUp() method creates...
    // a Postgres race condition. This holds true even if we call signIn() after awaiting...
    // the user creation. Inexplicable, so we bypass the email search and assume that should...
    // user object exist, the user is created and we will attempt logging in.
    if (user) {
      const passwordsMatch = bcrypt.compareSync(password, user.password);

      if (!passwordsMatch) {
        throw new Error('password: Incorrect password');
      }

      const authToken = jwt.sign(email.toLowerCase(), secret);

      if (process.env.NODE_ENV === 'production') {
        this.res.cookie('authToken', authToken, {
          maxAge: expiration,
          secure: true,
          sameSite: 'none',
          domain: '.guidelyte.dev',
        });
      } else {
        this.res.cookie('authToken', authToken, {
          maxAge: expiration,
        });
      }

      return user;
    }

    return user;
  }

  async currentUser(): Promise<User | null> {
    if (this._currentUser) {
      return this._currentUser;
    }

    // for manually testing authenticated methods in graphql playground
    // const email = jwt.verify(
    //   'eyJhbGciOiJIUzI1NiJ9.amFzb25Ad2FuZy5jb20.USIhvXNUhHpVp1fm8B5qhkx7z4D05ITddkkpQ6TrVyQ',
    //   secret,
    // ) as string;

    // if (email) {
    //   const user = await this.users.findByEmail(email);

    //   if (user) {
    //     this._currentUser = user;
    //   }

    //   return this._currentUser;
    // }

    if (this.req.cookies.authToken) {
      const email = jwt.verify(this.req.cookies.authToken, secret) as string;

      if (email) {
        const user = await this.users.findByEmail(email);

        if (user) {
          this._currentUser = user;
        }

        return this._currentUser;
      }
    }

    return null;
  }

  async _getApplePublicKeys(): Promise<any> {
    return axios
      .request({
        method: 'GET',
        url: 'https://appleid.apple.com/auth/keys',
      })
      .then((response) => response.data.keys);
  }

  async appleUser(token: string): Promise<any> {
    const keys = await this._getApplePublicKeys();
    const decodedToken = jwt.decode(token, {
      complete: true,
    });
    let kid: string;
    if (decodedToken !== null && typeof decodedToken == 'object') {
      kid = decodedToken.header.kid;
    }
    const key = keys.find((k: any) => k.kid === kid);

    const pubKey = new NodeRSA();
    pubKey.importKey(
      { n: Buffer.from(key.n, 'base64'), e: Buffer.from(key.e, 'base64') },
      'components-public',
    );
    const userKey = pubKey.exportKey('public');
    const algorithm: Algorithm[] = ['RS256'];
    return jwt.verify(token, userKey, { algorithms: algorithm });
  }

  async appleSignIn(token: string): Promise<User | null> {
    const { email, sub: appleUserId } = await this.appleUser(token);
    const existingAppleUser = await this.users.findByAppleUserId(appleUserId);

    // if new user, throw an error and prompt to sign up
    if (!existingAppleUser) {
      throw Error('appleID: Account not found, please sign up.');
    } else {
      // if the user has an account with us but changed his/her email, update that
      if (email !== existingAppleUser.email) {
        await this.users.updateAppleUser({ name: existingAppleUser.name, email, appleUserId });
      }
    }

    // verify the email from the decoded apple token matches a unique email in our DB
    const checkEmailMatch = await this.users.findByEmail(email.toLowerCase());

    // if so, sign the user in
    if (checkEmailMatch) {
      return this.signIn({ email, password: appleUserId });
    }

    return existingAppleUser;
  }

  async appleSignUp({
    firstName,
    lastName,
    email,
    token,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    token: string;
  }): Promise<User | null> {
    const name = `${firstName} ${lastName}`;
    const { sub: appleUserId } = await this.appleUser(token);
    const existingAppleUser = await this.users.findByAppleUserId(appleUserId);

    if (existingAppleUser) {
      // if existing apple user found, prompt to sign in
      throw Error('appleID: Account already exists, please log in.');
    }

    const newAppleUser = await this.users.newAppleUser({ name, email, appleUserId });

    // verify the user has been created in the DB
    const checkCreationSuccess = await this.users.findByEmail(email.toLowerCase());

    // if successful creation, automatically sign the user in
    if (checkCreationSuccess) {
      return this.signIn({ email, password: appleUserId });
    }

    return newAppleUser;
  }

  async googleSignIn({
    id,
    email,
    fullName,
    imageURL,
  }: {
    id: string;
    email: string;
    fullName: string;
    imageURL: string;
  }): Promise<User | null> {
    const existingGoogleUser = await this.users.findByGoogleUserId(id);

    if (!existingGoogleUser) {
      // if existing google user found, prompt to sign in
      throw Error('googleID: Account not found, please sign up.');
    } else {
      // if the user has an account with us but changed his/her email, update that
      if (
        email !== existingGoogleUser.email ||
        fullName !== existingGoogleUser.name ||
        imageURL !== existingGoogleUser.picture
      ) {
        await this.users.updateGoogleUser({ id, fullName, email, imageURL });
      }
    }

    // verify the user has been created in the DB
    const checkEmailMatch = await this.users.findByEmail(email.toLowerCase());

    // if so, sign the user in
    if (checkEmailMatch) {
      return this.signIn({ email: checkEmailMatch.email, password: id });
    }

    return existingGoogleUser;
  }

  async googleSignUp({
    id,
    email,
    fullName,
    imageURL,
  }: {
    id: string;
    email: string;
    fullName: string;
    imageURL: string;
  }): Promise<User | null> {
    const existingGoogleUser = await this.users.findByGoogleUserId(id);

    if (existingGoogleUser) {
      // if existing apple user found, prompt to sign in
      throw Error('googleID: Account already exists, please log in.');
    }

    const newGoogleUser = await this.users.newGoogleUser({
      id,
      email,
      fullName,
      imageURL,
    });

    // verify there is an email match, either updated from an existing account or newly created one
    const checkNewGoogleUserCreationSuccess = await this.users.findByEmail(email.toLowerCase());

    if (checkNewGoogleUserCreationSuccess) {
      return this.signIn({ email: checkNewGoogleUserCreationSuccess.email, password: id });
    }

    return newGoogleUser;
  }
}
