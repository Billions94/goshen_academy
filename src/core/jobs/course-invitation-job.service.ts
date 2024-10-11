import Bull from 'bull';
import { Inject, Service } from 'typedi';
import { CourseInvitationRepository } from '../../e-learning/course-invitation/repository/course-invitation.repository';
import Logger from '../../utils/logger/logger';
import { redisConnectionOptions } from './config';
import { JobDataOptions } from './interface';

@Service()
export class CourseInvitationJobService<Entity> {
  private readonly jobQueue: Bull.Queue;

  constructor(
    @Inject()
    private readonly courseInvitationRepository: CourseInvitationRepository
  ) {
    this.jobQueue = new Bull('jobQueue', redisConnectionOptions);

    this.jobQueue.process(async (job) => {
      Logger.info(`Processing job with data: ${JSON.stringify(job.data)}`);

      const courseInvitation = await this.courseInvitationRepository.findOne({
        where: { id: job.data.id },
      });

      if (!courseInvitation) return;
      else {
        await this.updateFieldsToFalse(this.courseInvitationRepository);
        Logger.info(`Processed job for course invitation ID: ${job.data.id}`);
      }
    });
  }

  public async addJob(jobData: JobDataOptions<Entity>) {
    const job = await this.jobQueue.add(jobData.entity, {
      delay: jobData.delay,
    });

    return job;
  }

  public async updateFieldsToFalse(itemRepository: CourseInvitationRepository) {
    try {
      await itemRepository
        .createQueryBuilder()
        .update('course_invitation')
        .set({ isValid: false })
        .where('expiresAt < NOW()')
        .execute();

      Logger.info('Fields successfully updated to false.');
    } catch (error) {
      Logger.error('Error updating fields:', error);
    }
  }
}
