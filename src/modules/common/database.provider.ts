import Dataloader from 'dataloader';
import { Pool, PoolClient, QueryResult } from 'pg';
import { SQLStatement } from 'sql-template-strings';

import { OnResponse } from '@graphql-modules/core';
import { Injectable, ProviderScope } from '@graphql-modules/di';

@Injectable({
  scope: ProviderScope.Session,
})
export class Database implements OnResponse {
  private instance!: PoolClient;
  private loader: Dataloader<string | SQLStatement, QueryResult | undefined>;

  constructor(private pool: Pool) {
    this.loader = new Dataloader(
      (queries) =>
        Promise.all(
          queries.map((query) => {
            const db = this.getClient();
            if (db) {
              return db.query(query);
            }

            return undefined;
          }),
        ),
      {
        cacheKeyFn: (key: string | SQLStatement): string => {
          let id: string;

          if (typeof key === 'string') {
            id = key;
          } else {
            id = key.text + ' - ' + JSON.stringify(key.values);
          }

          return id;
        },
        batch: false,
      },
    );
  }

  async onRequest(): Promise<void> {
    this.instance = await this.pool.connect();
  }

  onResponse(): void {
    if (this.instance) {
      this.instance.release();
    }
  }

  private getClient(): PoolClient | undefined {
    return this.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(query: SQLStatement | string): Promise<QueryResult<any> | undefined> {
    return this.loader.load(query);
  }
}
