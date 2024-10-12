import dotenv from 'dotenv';
import path from 'path';
import * as process from 'process';
import { DataSourceOptions } from 'typeorm';
import { CourseInvitation } from './e-learning/course-invitation/entity/course-invitation.entity';
import { Course } from './e-learning/course/entity/course.entity';
import { Lesson } from './e-learning/lessons/lesson/entity/lesson.entity';
import { LessonCategory } from './e-learning/lessons/lessonCategory/entity/lesson-category.entity';
import { LessonVideo } from './e-learning/lessons/lessonVideo/entity/lesson-video.entity';
import { Quiz } from './e-learning/quiz/entity/quiz.entity';
import { Result } from './e-learning/result/entity/result.entity';
import { Student } from './e-learning/students/entity/student.entity';
dotenv.config();

const isCompiled = path.extname(__filename).includes('js');

const ORMConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(<string>process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'test_db',
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  synchronize: process.env.NODE_ENV !== 'test',
  cache: true,
  entities: [
    Student,
    Course,
    CourseInvitation,
    Lesson,
    LessonCategory,
    LessonVideo,
    Quiz,
    Result,
  ],
  migrations: [`src/migration/**/*.${isCompiled ? 'js' : 'ts'}`],
  cli: {
    'entitiesDir': 'src/user/entity',
    'migrationsDir': 'src/migration',
  },
} as DataSourceOptions;

export default ORMConfig;
