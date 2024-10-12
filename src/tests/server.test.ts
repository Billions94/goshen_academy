import e from 'express';
import request from 'supertest';
import { DataBase } from '../db/init';
import { Server } from '../server';

describe('Server Integration Tests', () => {
  let serverInstance: Server;
  let app: e.Express;

  beforeAll(async () => {
    serverInstance = new Server();
    await serverInstance.start();
    app = serverInstance.getServerInstance();
  });

  beforeEach(async () => {
    const queryRunner = DataBase.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    const queryRunner = DataBase.dataSource.createQueryRunner();
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  afterAll(async () => {
    await DataBase.dataSource.destroy();
    await serverInstance.stop();
  });

  it('should return 200 for the health check endpoint', async () => {
    const response = await request(app).get('/health'); // Use an actual endpoint that exists in your app
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
  });

  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});
