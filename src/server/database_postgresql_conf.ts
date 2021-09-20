import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import ActiveSession from '../models/postgresql/activeSession';
import User from '../models/postgresql/user';


if (!process.env.SQLITE_PATH) {
  throw new Error('SQLITE_PATH environment variable is not set.');
}

const options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,  
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, ActiveSession],
  ssl: {
        rejectUnauthorized: false
  }
};

export let connection : Connection | undefined;

export const connect = async (): Promise<Connection | undefined> => {
  try {
    const conn = await createConnection(options);
    connection = conn;
    console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
  } catch (err) {
    console.log(err);
  }
  return undefined;
};