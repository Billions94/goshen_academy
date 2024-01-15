import { RequestHandler } from 'express';
import Logger from './logger';
import dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

const Requestlogger: RequestHandler = (req, _res, next) => {
  Logger.info(
    `${req.method} request to ${process.env.LOCAL_URL}:${process.env.PORT}${req.path}`
  );
  next();
};

export default Requestlogger;
