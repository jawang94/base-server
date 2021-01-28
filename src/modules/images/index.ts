import { gql } from 'apollo-server-express';

import { GraphQLModule } from '@graphql-modules/core';

import { Resolvers } from '../../types/graphql';
import CommonModule from '../common';
import { Images } from './images.provider';

const typeDefs = gql`
  type ReturnObject {
    image: JSONObject
  }

  extend type Mutation {
    resizeImage(url: String!, height: Int, width: Int!, format: String): ReturnObject
  }
`;

const resolvers: Resolvers = {
  Mutation: {
    async resizeImage(
      _: any,
      { url, height, width, format }: any,
      { injector }: any,
    ): Promise<any> {
      return injector.get(Images).resizeImage({ url, height, width, format });
    },
  },
};

export default new GraphQLModule({
  name: 'images',
  typeDefs,
  resolvers,
  imports: (): GraphQLModule[] => [CommonModule],
  providers: (): [typeof Images] => [Images],
});
