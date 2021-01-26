import { Pool } from 'pg';
import sql from 'sql-template-strings';

import { resetDb as envResetDb } from '../env';

// Mapped to User type in graphql.d.ts
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  picture: string;
};

export const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const pool: Pool = new Pool(dbConfig);

export async function initDb(): Promise<void> {
  // Clear tables
  await pool.query(sql`DROP TABLE IF EXISTS users;`);
  await pool.query(sql`DROP TABLE IF EXISTS newsletter;`);

  // Create tables
  await pool.query(sql`CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    picture VARCHAR (255) NOT NULL
  );`);

  await pool.query(sql`CREATE TABLE newsletter(
    id SERIAL PRIMARY KEY,
    email VARCHAR (255) UNIQUE NOT NULL
  );`);

  // Privileges
  await pool.query(sql`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jason;`);
}

export const resetDb = async (): Promise<void> => {
  await initDb();

  const sampleUsers = [
    {
      id: '1',
      name: 'Jason Wang',
      email: 'jason@wang.com',
      password: '$2a$08$NO9tkFLCoSqX1c5wk3s7z.JfxaVMKA.m7zUDdDwEquo4rvzimQeJm', // 111
      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
    },
    {
      id: '2',
      name: 'Sepehr Bostanbakhsh',
      email: 'sep@bos.com',
      password: '$2a$08$xE4FuCi/ifxjL2S8CzKAmuKLwv18ktksSN.F3XYEnpmcKtpbpeZgO', // 222
      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    },
    {
      id: '3',
      name: 'Sam Kung',
      email: 'sam@kung.com',
      password: '$2a$08$UHgH7J8G6z1mGQn2qx2kdeWv0jvgHItyAsL9hpEUI3KJmhVW5Q1d.', // 333
      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
    },
    {
      id: '4',
      name: 'Stefan Layanto',
      email: 'stef@layanto.com',
      password: '$2a$08$wR1k5Q3T9FC7fUgB7Gdb9Os/GV7dGBBf4PLlWT7HERMFhmFDt47xi', // 444
      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
    },
    {
      id: '5',
      name: 'First User',
      email: 'first@user.com',
      password: '$2a$08$6.mbXqsDX82ZZ7q5d8Osb..JrGSsNp4R3IKj7mxgF6YGT0OmMw242', // 555
      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
    },
  ];

  for (const sampleUser of sampleUsers) {
    await pool.query(sql`
      INSERT INTO users(id, name, email, password, picture)
      VALUES(${sampleUser.id}, ${sampleUser.name},
             ${sampleUser.email}, ${sampleUser.password}, 
             ${sampleUser.picture})
    `);
  }

  await pool.query(sql`SELECT setval('users_id_seq', (SELECT max(id) FROM users))`);

  await pool.query(sql`SELECT setval('users_id_seq', (SELECT max(id) FROM users))`);
};

if (envResetDb) {
  resetDb();
}
