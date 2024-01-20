import { Express, Router } from 'express';
import listEndpoints from 'express-list-endpoints';
import { Server } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { StudentController } from '../e-learning/students/controller/studentController';
import { LessonController } from '../e-learning/lessons/lesson/controller/lessonController';
import { LessonCategoryController } from '../e-learning/lessons/lessonCategory/controller/lessonCategoryController';
import { QuizController } from '../e-learning/quiz/controller/quizController';
import { ResultController } from '../e-learning/result/controller/resultController';
import { LessonVideoController } from '../e-learning/lessons/lessonVideo/controller/lessonVideoController';

/**
 * Class for handling routers and controllers
 */
export class RouteHandler {
  @Inject
  private readonly studentController: StudentController;
  @Inject
  private readonly lessonController: LessonController;
  @Inject
  private readonly lessonCategoryController: LessonCategoryController;
  @Inject
  private readonly lessonVideoController: LessonVideoController;
  @Inject
  private readonly quizController: QuizController;
  @Inject
  private readonly resultController: ResultController;

  /**
   * @remarks This is a custom method.
   * Creates routes for all classes we annotate with decorators from typescript-rest
   * and utilizes all controllers specified in the patterns param in the loadControllers method
   * @param server - Express Application Server.
   * @returns Void.
   * @beta
   */
  initialize(server: Express): void {
    const router = Router();
    Server.buildServices(server);
    Server.loadControllers(router, 'controller/*', __dirname);
    console.table(listEndpoints(server));
  }
}
