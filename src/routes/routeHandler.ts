import { Express } from 'express';
import { Action, createExpressServer } from 'routing-controllers';
import { LessonController } from '../e-learning/lessons/lesson/controller/lessonController';
import { LessonCategoryController } from '../e-learning/lessons/lessonCategory/controller/lessonCategoryController';
import { LessonVideoController } from '../e-learning/lessons/lessonVideo/controller/lessonVideoController';
import { QuizController } from '../e-learning/quiz/controller/quizController';
import { ResultController } from '../e-learning/result/controller/resultController';
import { StudentController } from '../e-learning/students/controller/studentController';
import { AuthGuard } from '../middlewares/authGuard';
import { RequireUser } from '../middlewares/requireUser';
import RequestLogger from '../utils/logger/requestLogger';

/**
 * Class for handling routers and controllers
 */
export class RouteHandler {
  /**
   * Initializes and configures an Express server with routing-controllers and custom middlewares.
   *
   * @returns An Express application instance with the configured routes and middlewares.
   */
  public static initialize(): Express {
    return createExpressServer({
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
  }
}
