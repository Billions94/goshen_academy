import { config } from 'dotenv';
import { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import 'reflect-metadata';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';
import { DataBase } from './db/init';
import { RouteHandler } from './routes/routeHandler';
import Logger from './utils/logger/logger';

config({ path: '.env' });
useContainer(Container);
export class Server {
  private readonly server: Express;
  private readonly port = parseInt(process.env.PORT ?? '8080');

  constructor() {
    this.server = RouteHandler.initialize();
    this.connect();
  }

  private connect(): void {
    DataBase.connect().then(() =>
      this.server.listen(this.port, () => {
        Logger.info(`server is listening on http://localhost:${this.port}`);
        console.table(listEndpoints(this.server));
      })
    );
  }
}

new Server();
