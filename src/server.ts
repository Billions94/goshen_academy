import http from 'http';
import 'reflect-metadata';

import { config } from 'dotenv';
import { Express } from 'express';
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
  private httpServer: http.Server;

  constructor() {
    this.server = RouteHandler.initialize();
    this.start();
  }

  public async start(): Promise<void> {
    await DataBase.connect();
    this.httpServer = this.server.listen(this.port, '0.0.0.0', () => {
      Logger.info(
        `Server is listening on ${
          process.env.NODE_ENV === 'development'
            ? `http://localhost:${this.port}`
            : `${process.env.PROD_URL}`
        }`
      );

      this.server._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
          Logger.info(
            `Initialized controller for route: [${Object.keys(
              middleware.route.methods
            )[0].toUpperCase()} -> ${middleware.route.path}]`
          );
        }
      });
    });
  }

  public stop(): void {
    if (this.httpServer) {
      this.httpServer.close();
      Logger.info('Server has been stopped');
    }
  }

  public getServerInstance(): Express {
    return this.server;
  }
}

new Server();
