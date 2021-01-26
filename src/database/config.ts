const defaultConfig = {
  client: 'pg',
  connection: {
    database: 'post',
    user: 'postgres',
    password: 'root',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
  timezone: 'UTC',
};
interface KnexConfig {
  [key: string]: object;
}
const config: KnexConfig = {
  development: {
    ...defaultConfig,
  },
  testing: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
  },
};

export default config;
