import bcrypt from 'bcrypt';
import { QueryResult } from 'pg';
import sql from 'sql-template-strings';

import { Inject, Injectable, ProviderScope } from '@graphql-modules/di';

import { User } from '../../database/db';
import { Database } from '../common/database.provider';

const DEFAULT_PROFILE_PIC =
  'https://raw.githubusercontent.com/Urigo/WhatsApp-Clone-Client-React' +
  '/legacy/public/assets/default-profile-pic.jpg';

@Injectable({
  scope: ProviderScope.Session,
})
export class Users {
  @Inject() private db!: Database;

  // For query resolver user in users/index.ts
  async findById(userId: string): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(
      sql`SELECT * FROM users WHERE id = ${userId}`,
    );

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }

  async findByAppleUserId(appleUserId: string): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(
      sql`SELECT * FROM users WHERE apple_user_id = ${appleUserId}`,
    );

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }

  async findByGoogleUserId(googleUserId: string): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(
      sql`SELECT * FROM users WHERE google_user_id = ${googleUserId}`,
    );

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }

  // For query resolver users in users/index.ts
  async findAllExcept(userId: string): Promise<User[]> {
    const result: QueryResult<User> | undefined = await this.db.query(
      sql`SELECT * FROM users WHERE id != ${userId}`,
    );

    if (result && result.rows) {
      return result.rows;
    }

    return [];
  }

  // For getting currentUser() and signIn() in auth.provider
  async findByEmail(email: string): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(
      sql`SELECT * FROM users WHERE email = ${email}`,
    );

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }

  // For getting currentUser() and signIn() in auth.provider
  async updateAppleUser({
    name,
    email,
    appleUserId,
  }: {
    name: string;
    email: string;
    appleUserId: string;
  }): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(sql`
        UPDATE users
        SET name = ${name},
            email = ${email}
        WHERE apple_user_id = ${appleUserId}
        RETURNING *
      `);

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }

  // For signUp() method in auth.provider
  async newUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<User | null> {
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const createdUserQuery = await this.db.query(sql`
        INSERT INTO users(password, picture, email, name)
        VALUES(${passwordHash}, ${DEFAULT_PROFILE_PIC}, ${email.toLowerCase()}, ${name})
        RETURNING *
      `);

    let user;
    if (createdUserQuery && createdUserQuery.rows) {
      user = createdUserQuery.rows[0];
    }

    return user;
  }

  async newAppleUser({
    name,
    email,
    appleUserId,
  }: {
    name: string;
    email: string;
    appleUserId: string;
  }): Promise<User | null> {
    const passwordHash = bcrypt.hashSync(appleUserId, bcrypt.genSaltSync(8));
    const createdUserQuery = await this.db.query(sql`
        INSERT INTO users(apple_user_id, password, picture, email, name)
        VALUES(${appleUserId}, ${passwordHash}, ${DEFAULT_PROFILE_PIC}, ${email.toLowerCase()}, ${name})
        RETURNING *
      `);

    let user;
    if (createdUserQuery && createdUserQuery.rows) {
      user = createdUserQuery.rows[0];
    }

    return user;
  }

  async newGoogleUser({
    id,
    fullName,
    email,
    imageURL,
  }: {
    id: string;
    fullName: string;
    email: string;
    imageURL: string;
  }): Promise<User | null> {
    const passwordHash = bcrypt.hashSync(id, bcrypt.genSaltSync(8));
    const createdUserQuery = await this.db.query(sql`
        INSERT INTO users(google_user_id, password, picture, email, name)
        VALUES(${id}, ${passwordHash}, ${imageURL}, ${email.toLowerCase()}, ${fullName})
        RETURNING *
      `);

    let user;
    if (createdUserQuery && createdUserQuery.rows) {
      user = createdUserQuery.rows[0];
    }

    return user;
  }

  async updateGoogleUser({
    id,
    fullName,
    email,
    imageURL,
  }: {
    id: string;
    fullName: string;
    email: string;
    imageURL: string;
  }): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(sql`
        UPDATE users
        SET name = ${fullName},
            email = ${email},
            picture = ${imageURL}
        WHERE google_user_id = ${id}
        RETURNING *
      `);

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }

  async updateCurrentUser({
    onboarded,
    userId,
  }: {
    onboarded: boolean;
    userId: string;
  }): Promise<User | null> {
    const result: QueryResult<User> | undefined = await this.db.query(sql`
        UPDATE users
        SET onboarded = ${onboarded}
        WHERE id = ${userId}
        RETURNING *
      `);

    if (result && result.rows) {
      return result.rows[0];
    }

    return null;
  }
}
