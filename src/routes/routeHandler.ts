import { Application } from 'express';
import path from 'path';
import { Action, createExpressServer } from 'routing-controllers';
import { Inject } from 'typedi';
import { StudentService } from '../e-learning/students/service/studentService';

/**
 * Class for handling routers and controllers
 */
export class RouteHandler {
  @Inject()
  private readonly studentService: StudentService;

  initialize(): Application {
    const app = createExpressServer({
      currentUserChecker: async (action: Action) =>
        this.studentService.getStudent(action.request?.user),
      routePrefix: '/api',
      controllers: [path.join(__dirname + '/controllers/*')],
    });

    return app;
  }
}
