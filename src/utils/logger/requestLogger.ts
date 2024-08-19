import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import * as process from 'process';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import Logger from './logger';
dotenv.config();

@Service()
@Middleware({ type: 'before' })
class RequestLogger implements ExpressMiddlewareInterface {
  use(req: Request, _res: Response, next: NextFunction) {
    const { page, limit, key, value } = req.query;

    Logger.info(
      `${req.method} request to ${process.env.LOCAL_URL}:${
        process.env.PORT
      }/api${req.path}${
        <any>req.query.length > 0
          ? `?${
              'page=' +
              page +
              '&' +
              'limit=' +
              limit +
              '&' +
              'key=' +
              key +
              '&' +
              'value=' +
              value
            }`
          : ''
      }`
    );

    next();
  }
}

export default RequestLogger;
