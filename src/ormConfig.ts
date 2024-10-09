import dotenv from 'dotenv';
import path from 'path';
import * as process from 'process';
import { DataSourceOptions } from 'typeorm';
dotenv.config();

const isCompiled = path.extname(__filename).includes('js');

const ORMConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(<string>process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'postgres',
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  cache: true,
  entities: [
    `src/e-learning/students/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/e-learning/course/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/e-learning/course-invitation/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
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
