import Queue from 'bull';
import { Inject, Service } from 'typedi';
import { CartPurchase } from '../../cart/service/interface';
import { redisConnectionOptions } from '../../core/jobs/config';
import Logger from '../../utils/logger/logger';
import { EmailService } from '../service/email.service';

@Service()
export class EmailJobService {
  private emailQueue: Queue.Queue;
  @Inject()
  private readonly emailService: EmailService;

  constructor() {
    this.emailQueue = new Queue('email', redisConnectionOptions);

    // Initialize the email service
    this.emailService = new EmailService();
    this.processJobs();
  }

  public async addJob(purchaseDetails: CartPurchase) {
    await this.emailQueue.add({ purchaseDetails });
  }

  private processJobs() {
    this.emailQueue.process(async (job) => {
      const { purchaseDetails } = job.data;

      await this.emailService.sendPurchaseConfirmationEmail(purchaseDetails);
    });

    this.emailQueue.on('failed', (job, error) => {
      Logger.error(`Job failed for student ${job.data.email}:`, error);
    });
  }
}
