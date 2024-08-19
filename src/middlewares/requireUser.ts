import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class RequireUser implements ExpressMiddlewareInterface {
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

    return next();
  }
}
