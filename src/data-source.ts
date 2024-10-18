import dotenv from 'dotenv';
import { resolve } from 'path';
import * as process from 'process';
import { DataSource } from 'typeorm';
import { Cart } from './cart/entity/cart.entity';

import { CourseInvitation } from './e-learning/course-invitation/entity/course-invitation.entity';
import { Course } from './e-learning/course/entity/course.entity';
import { LessonCategory } from './e-learning/lessons/lesson-category/entity/lesson-category.entity';
import { LessonVideo } from './e-learning/lessons/lesson-video/entity/lesson-video.entity';
import { Lesson } from './e-learning/lessons/lesson/entity/lesson.entity';
import { Quiz } from './e-learning/quiz/entity/quiz.entity';
import { Result } from './e-learning/result/entity/result.entity';
import { Student } from './e-learning/students/entity/student.entity';
import { Product } from './product/entity/product.entity';
dotenv.config();

const ORMConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(<string>process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'test_db',
  logging: !process.env.DB_NO_LOGS,
  synchronize: process.env.NODE_ENV !== 'test',
  cache: true,
  entities: [
    Student,
    Cart,
    Product,
    Course,
    CourseInvitation,
    Lesson,
    LessonCategory,
    LessonVideo,
    Quiz,
    Result,
  ],
  migrations: [resolve('src/migrations/**/*{.ts,.js}')],
});

export default ORMConfig;
