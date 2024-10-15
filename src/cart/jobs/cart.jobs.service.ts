import Bull from 'bull';
import { Inject, Service } from 'typedi';
import { redisConnectionOptions } from '../../core/jobs/config';
import { JobDataOptions } from '../../core/jobs/interface';
import { Input } from '../../e-learning/interfaces';
import Logger from '../../utils/logger/logger';
import { CartRepository } from '../repository/cart.repository';

@Service()
export class CartJobService<Entity> {
  private readonly jobQueue: Bull.Queue;

  constructor(
    @Inject()
    private readonly cartRepository: CartRepository
  ) {
    this.jobQueue = new Bull('jobQueue', redisConnectionOptions);
    this.processJobs();
  }

  public async addJob(
    jobData: JobDataOptions<Input<Omit<Entity, 'deletedAt'>>>
  ) {
    const job = await this.jobQueue.add(jobData.entity, {
      delay: jobData.delay,
    });

    return job;
  }

  private processJobs() {
    this.jobQueue.process(async (job) => {
      Logger.info(`Processing cart job with data: ${JSON.stringify(job.data)}`);

      const cart = await this.cartRepository.findOne({
        where: { id: job.data.id },
      });

      if (!cart) {
        // create a new cart
        await this.cartRepository.save(job.data);
        Logger.info(
          `Created new cart for user with ID: ${job.data.student.id}`
        );
      } else {
        // update the existing cart
        await this.cartRepository.update(job.data.id, job.data);
        Logger.info(`Updated cart for user with ID: ${job.data.student.id}`);
      }
    });
  }
}
