import { ConnectionOptions } from 'typeorm';
import path from 'path';

const type = 'postgres';
const host = process.env.APP_DB_HOST;
const port = Number(process.env.APP_DB_PORT);
const username = process.env.APP_DB_USERNAME;
const password = process.env.APP_DB_PASSWORD;
const database = process.env.APP_DB_NAME;


const config: ConnectionOptions = {
  type,
  host,
  port,
  username,
  password,
  database,
  entities: [`${path.join(__dirname + './../entity')}/*.entity{.ts,.js}`],
  synchronize: false,
  migrationsRun: true,
  migrations: [
    "dist/src/migrations/*.js"
  ],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
 
export = config;