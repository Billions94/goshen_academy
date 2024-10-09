import { Express } from 'express';
import { Action, createExpressServer } from 'routing-controllers';
import { CourseInvitationController } from '../e-learning/course-invitation/controller/course-invitation.controller';
import { CourseController } from '../e-learning/course/controller/course.controller';
import { LessonController } from '../e-learning/lessons/lesson/controller/lesson.controller';
import { LessonCategoryController } from '../e-learning/lessons/lessonCategory/controller/lesson-category.controller';
import { LessonVideoController } from '../e-learning/lessons/lessonVideo/controller/lesson-video.controller';
import { QuizController } from '../e-learning/quiz/controller/quiz.controller';
import { ResultController } from '../e-learning/result/controller/result.controller';
import { StudentController } from '../e-learning/students/controller/student.controller';
import { AuthGuard } from '../middlewares/authGuard';
import { PinoLoggerMiddleware } from '../middlewares/requestLogger';
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
      authorizationChecker: ({ request: { user } }: Action) => {
        if (!user) return false;
        return user.isAdmin ? true : false;
      },
      routePrefix: '/api',
      controllers: [
        CourseController,
        CourseInvitationController,
        LessonController,
        LessonCategoryController,
        LessonVideoController,
        QuizController,
        ResultController,
        StudentController,
      ],
      middlewares: [
        AuthGuard,
        RequireUser,
        RequestLogger,
        PinoLoggerMiddleware,
      ],
    });
  }
}
