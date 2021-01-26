import { gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';

import { resetDb } from '../../src/database/db';
import { server } from '../../src/server';
import { mockAuth } from '../mocks/auth.provider';

describe('Query.getUsers', () => {
  beforeEach(resetDb);

  it('should fetch all users except the one signed-in', async () => {
    mockAuth(1);

    const { query } = createTestClient(server);

    let res = await query({
      query: gql`
        query GetUsers {
          users {
            id
            name
            picture
          }
        }
      `,
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();

    mockAuth(2);

    res = await query({
      query: gql`
        query GetUsers {
          users {
            id
            name
            picture
          }
        }
      `,
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();
  });
});
