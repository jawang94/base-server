import { gql } from 'apollo-server-express';
import {
  DateTimeResolver,
  EmailAddressResolver,
  JSONObjectResolver,
  JSONResolver,
  PhoneNumberResolver,
  URLResolver,
} from 'graphql-scalars';
import { Pool } from 'pg';

import { GraphQLModule } from '@graphql-modules/core';
import { Provider, ProviderScope } from '@graphql-modules/di';

import { dbConfig, pool } from '../../database/db';
import { Resolvers } from '../../types/graphql';
import { Database } from './database.provider';
import { PubSub } from './pubsub.provider';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PostgresPubSub } = require('graphql-postgres-subscriptions');

const typeDefs = gql`
  scalar DateTime
  scalar URL
  scalar EmailAddress
  scalar JSON
  scalar JSONObject
  scalar PhoneNumber

  type Query {
    _dummy: Boolean
  }

  type Mutation {
    _dummy: Boolean
  }

  type Subscription {
    _dummy: Boolean
  }
`;

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  EmailAddress: EmailAddressResolver,
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
  PhoneNumber: PhoneNumberResolver,
};

const pubsub = new PostgresPubSub(dbConfig);

export default new GraphQLModule({
  name: 'common',
  typeDefs,
  resolvers,
  providers: (): Provider[] => [
    {
      provide: Pool,
      useValue: pool,
    },
    {
      provide: PubSub,
      scope: ProviderScope.Application,
      useValue: pubsub,
    },
    Database,
  ],
});
