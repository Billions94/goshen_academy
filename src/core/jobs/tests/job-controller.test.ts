import Bull from 'bull';
import e from 'express';
import request from 'supertest';
import { DataBase } from '../../../db/init';
import { Server } from '../../../server';

describe('Job Controller Integration Tests', () => {
  let jobQueue: Bull.Queue;
  let serverInstance: Server;
  let app: e.Express;

  beforeAll(async () => {
    jobQueue = new Bull('jobQueue', {
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    });

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
    await jobQueue.close();
    await DataBase.dataSource.destroy();
    await serverInstance.stop();
  });

  it('should create a job and return its ID', async () => {
    const response = await request(app)
      .post('/jobs')
      .send({
        task: 'Send Email',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 60000),
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.data).toEqual({
      task: 'Send Email',
      email: 'test@example.com',
    });
  });

  it('should delay job execution according to expiresAt', async () => {
    const expiresAt = new Date(Date.now() + 30000); // 30 seconds in the future
    const response = await request(app)
      .post('/jobs')
      .send({ task: 'Process Data', expiresAt });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');

    const jobId = response.body.id;
    const job = await jobQueue.getJob(jobId);
    expect(job).not.toBeNull();
    expect((job as any)?.delay).toBeGreaterThan(0);
  });
});
