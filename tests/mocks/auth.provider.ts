import sql from 'sql-template-strings';
import { Auth } from '../../src/modules/users/auth.provider';
import usersModule from '../../src/modules/users';
import { pool } from '../../src/database/db';

export function mockAuth(userId: number): void {
  class AuthMock extends Auth {
    async currentUser(): Promise<any> {
      const { rows } = await pool.query(sql`SELECT * FROM users WHERE id = ${userId}`);
      return rows[0];
    }
  }

  usersModule.injector.provide({
    provide: Auth,
    useClass: AuthMock,
    overwrite: true,
  });
}
