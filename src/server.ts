import cors from 'cors';
import { config } from 'dotenv';
import express, { Express } from 'express';
import 'reflect-metadata';
import { Inject } from 'typescript-ioc';
import { DataBase } from './db/init';
import { AuthGuard } from './middlewares/authGuard';
import { RequireUser } from './middlewares/requireUser';
import { RouteHandler } from './routes/routeHandler';
import Logger from './utils/logger/logger';
import Requestlogger from './utils/logger/requestLogger';

config({ path: '.env' });
export class Server {
  @Inject
  private readonly authGuard: AuthGuard;
  @Inject
  private readonly requireUser: RequireUser;
  @Inject
  private readonly routes: RouteHandler;
  private readonly server: Express;
  private readonly port = parseInt(process.env.PORT ?? '8080');

  constructor() {
    this.server = express();
    this.server.use(cors({ origin: '*' }));
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(Requestlogger);
    this.connect();
    this.activateGuards();
    this.loadRoutes();
  }

  private connect(): void {
    DataBase.connect().then(() =>
      this.server.listen(this.port, '0.0.0.0', () =>
        Logger.info(`server is listening on http://localhost:${this.port}`)
      )
    );
  }

  private activateGuards(): void {
    this.server.use(this.authGuard.init);
    this.server.use(this.requireUser.init);
  }

  private loadRoutes(): void {
    this.routes.initialize(this.server);
  }
}

new Server();
