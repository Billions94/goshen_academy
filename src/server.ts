import { config } from 'dotenv';
import { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import 'reflect-metadata';
import { Action, createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';
import { DataBase } from './db/init';
import { LessonController } from './e-learning/lessons/lesson/controller/lessonController';
import { LessonCategoryController } from './e-learning/lessons/lessonCategory/controller/lessonCategoryController';
import { LessonVideoController } from './e-learning/lessons/lessonVideo/controller/lessonVideoController';
import { QuizController } from './e-learning/quiz/controller/quizController';
import { ResultController } from './e-learning/result/controller/resultController';
import { StudentController } from './e-learning/students/controller/studentController';
import { AuthGuard } from './middlewares/authGuard';
import { RequireUser } from './middlewares/requireUser';
import Logger from './utils/logger/logger';
import RequestLogger from './utils/logger/requestLogger';

config({ path: '.env' });
useContainer(Container);
export class Server {
  private readonly server: Express;
  private readonly port = parseInt(process.env.PORT ?? '8080');

  constructor() {
    this.server = createExpressServer({
      cors: { origin: '*' },
      currentUserChecker: ({ request: { user } }: Action) => user,
      authorizationChecker: ({ request: { user } }: Action) =>
        user.isAdmin ? true : false,
      routePrefix: '/api',
      controllers: [
        StudentController,
        LessonController,
        LessonCategoryController,
        LessonVideoController,
        QuizController,
        ResultController,
      ],
      middlewares: [AuthGuard, RequireUser, RequestLogger],
    });
    this.connect();
  }

  private connect(): void {
    DataBase.connect().then(() =>
      this.server.listen(this.port, () => {
        Logger.info(`server is listening on http://localhost:${this.port}`);
        console.table(listEndpoints(this.server));
      })
    );
  }
}

new Server();
