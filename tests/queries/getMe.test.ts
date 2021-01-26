import { gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';

import { resetDb } from '../../src/database/db';
import { server } from '../../src/server';
import { mockAuth } from '../mocks/auth.provider';

describe('Query.me', () => {
  beforeEach(resetDb);

  it('should fetch current user', async () => {
    mockAuth(1);

    const { query } = createTestClient(server);

    const res = await query({
      query: gql`
        query GetMe {
          me {
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

// GQL awaits are failing in CI due to UnhandledPromiseRejection. Resolve later. Disabling tests for CI.
