import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import cookie from 'cookie';

import { GraphQLModule } from '@graphql-modules/core';

import { MyContext } from './context';
import UsersModule from './modules/users';
import ImagesModule from './modules/images';

export const rootModule = new GraphQLModule({
  name: 'root',
  imports: [UsersModule, ImagesModule],
});

export const server = new ApolloServer({
  schema: rootModule.schema,
  context: (session): Promise<MyContext> => {
    if (session.connection) {
      const req = session.connection.context.session.request;
      const cookies = req.headers.cookie;

      if (cookies) {
        req.cookies = cookie.parse(cookies);
      }
    }

    return rootModule.context(session);
  },
  introspection: true,
  playground: true,
  subscriptions: rootModule.subscriptions,
});
