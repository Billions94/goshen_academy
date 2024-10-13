import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { Privilege } from '../e-learning/students/interface';
import Logger from '../utils/logger/logger';

@Service()
@Middleware({ type: 'before' })
export class RequireUser implements ExpressMiddlewareInterface {
  private readonly message =
    'You do not have the required privileges to perform this action';

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (
      req.method === 'GET' ||
      req.path.includes('register') ||
      req.path.includes('login')
    ) {
      return next();
    }

    if (!user) {
      return res.sendStatus(403);
    }

    if (req.method === 'POST' || req.method === 'PATCH') {
      if (!user.privileges.includes(Privilege.WRITE)) {
        Logger.warn('User does not have the required privileges');

        return res.status(403).send({
          status: 403,
          error: { message: this.message },
        });
      }
    } else if (req.method === 'DELETE') {
      if (!user.privileges.includes(Privilege.DELETE)) {
        Logger.warn('User does not have the required privileges');

        return res.status(403).send({
          status: 403,
          error: { message: this.message },
        });
      }
    }

    return next();
  }
}
