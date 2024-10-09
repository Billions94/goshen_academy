import 'reflect-metadata';

import { config } from 'dotenv';
import { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';
import { DataBase } from './db/init';
import { RouteHandler } from './routes/routeHandler';
import Logger from './utils/logger/logger';

config();
useContainer(Container);
export class Server {
  private readonly server: Express;
  private readonly port = parseInt(process.env.PORT ?? '3001');

  constructor() {
    this.server = RouteHandler.initialize();
    this.connect();
  }

  private connect(): void {
    DataBase.connect().then(() =>
      this.server.listen(this.port, '0.0.0.0', () => {
        Logger.info(`server is listening on http://localhost:${this.port}`);
        console.table(listEndpoints(this.server));
      })
    );
  }
}

new Server();
