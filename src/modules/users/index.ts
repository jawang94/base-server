import { gql } from 'apollo-server-express';

import { GraphQLModule } from '@graphql-modules/core';

import { User } from '../../database/db';
import { Resolvers } from '../../types/graphql';
import CommonModule from '../common';
import { Auth } from './auth.provider';
import { Users } from './users.provider';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: EmailAddress!
    picture: URL!
  }

  type AppleUser {
    iss: String
    sub: String
    aud: String
    iat: String
    exp: String
    none: String
    nonce_supported: Boolean
    email: EmailAddress
    email_verified: String
    is_private_email: String
    real_user_status: Int
  }

  extend type Query {
    me: User
    users: [User!]!
  }

  extend type Mutation {
    signIn(email: String!, password: String!): User
    signUp(name: String!, email: String!, password: String!, passwordConfirm: String!): User
    appleSignIn(token: String!): User
    appleSignUp(firstName: String!, lastName: String!, email: String!, token: String!): User
    googleSignIn(id: String!, email: String!, fullName: String!, imageURL: String!): User
    googleSignUp(id: String!, email: String!, fullName: String!, imageURL: String!): User
  }
`;

const resolvers: Resolvers = {
  Query: {
    me(_, __, { injector }): Promise<User | null> {
      return injector.get(Auth).currentUser();
    },
    async users(_, __, { injector }): Promise<User[]> {
      const currentUser = await injector.get(Auth).currentUser();

      if (!currentUser) return [];

      return injector.get(Users).findAllExcept(currentUser.id);
    },
  },
  Mutation: {
    async signIn(_, { email, password }, { injector }): Promise<User> {
      return injector.get(Auth).signIn({ email, password });
    },
    async signUp(
      _,
      { name, email, password, passwordConfirm },
      { injector },
    ): Promise<User | null> {
      return injector.get(Auth).signUp({ name, email, password, passwordConfirm });
    },
    async appleSignIn(_: any, { token }: any, { injector }: any): Promise<User | null> {
      return injector.get(Auth).appleSignIn(token);
    },
    async appleSignUp(
      _: any,
      { firstName, lastName, email, token }: any,
      { injector }: any,
    ): Promise<User | null> {
      return injector.get(Auth).appleSignUp({ firstName, lastName, email, token });
    },
    async googleSignIn(
      _: any,
      { id, email, fullName, imageURL }: any,
      { injector }: any,
    ): Promise<User | null> {
      return injector.get(Auth).googleSignIn({ id, email, fullName, imageURL });
    },
    async googleSignUp(
      _: any,
      { id, email, fullName, imageURL }: any,
      { injector }: any,
    ): Promise<User | null> {
      return injector.get(Auth).googleSignUp({ id, email, fullName, imageURL });
    },
  },
};

export default new GraphQLModule({
  name: 'users',
  typeDefs,
  resolvers,
  imports: (): GraphQLModule[] => [CommonModule],
  providers: (): (typeof Users | typeof Auth)[] => [Users, Auth],
});
