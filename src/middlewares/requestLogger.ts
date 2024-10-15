import { NextFunction, Request, Response } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import Logger from '../utils/logger/logger';

export const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
  },
});

@Service()
@Middleware({ type: 'before' }) // Executes before controller actions
export class RequestLogger implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    const { page, limit, key, value } = req.query;

    Logger.info(
      `${req.method} request to ${
        process.env.NODE_ENV === 'development'
          ? process.env.LOCAL_URL
          : process.env.PROD_URL
      }:${process.env.PORT}/api${req.path}${
        Object.keys(req.query).length > 0
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

    const pinoHttpMiddleware = pinoHttp({
      logger: Logger,
      customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return 'warn';
        } else if (res?.statusCode >= 500 || err) {
          return 'error';
        }
        return 'info';
      },
      serializers: {
        req: (req: Request) => ({
          method: req.method,
          url: req.url,
          headers: {
            'cache-control': req.headers['cache-control'],
            'content-type': req.headers['content-type'],
          },
          data: req.body,
          params: req.params,
        }),
        res: ({ statusCode }: Response) => ({
          statusCode,
        }),
      },
    });

    pinoHttpMiddleware(req, res, next);
  }
}
