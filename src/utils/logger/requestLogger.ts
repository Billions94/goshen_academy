import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import * as process from 'process';
import Logger from './logger';
dotenv.config();

const Requestlogger: RequestHandler = (req, _res, next) => {
  Logger.info(
    `${req.method} request to ${process.env.LOCAL_URL}:${process.env.PORT}${req.path}`
  );
  next();
};

export default Requestlogger;
