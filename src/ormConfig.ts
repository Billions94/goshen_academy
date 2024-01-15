import { DataSourceOptions } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

const isCompiled = path.extname(__filename).includes('js');

const ORMConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'typeorm',
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [
    `src/e-learning/students/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/e-learning/lessons/lesson/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/e-learning/lessons/lessonCategory/entity/**/*.${
      isCompiled ? 'js' : 'ts'
    }`,
    `src/e-learning/lessons/lessonVideo/entity/**/*.${
      isCompiled ? 'js' : 'ts'
    }`,
    `src/e-learning/quiz/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/e-learning/result/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
  ],
  migrations: [`src/migration/**/*.${isCompiled ? 'js' : 'ts'}`],
  cli: {
    'entitiesDir': 'src/user/entity',
    'migrationsDir': 'src/migration',
  },
} as DataSourceOptions;

export default ORMConfig;
