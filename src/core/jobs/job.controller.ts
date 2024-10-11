import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { CourseInvitationJobService } from './course-invitation-job.service';

@Service()
@JsonController('/jobs')
export class JobController {
  constructor(
    @Inject()
    private CourseInvitationJobService: CourseInvitationJobService<{}>
  ) {}

  @Post()
  async createJob(@Body() jobData: any) {
    const job = await this.CourseInvitationJobService.addJob(jobData);
    return { id: job.id, data: jobData };
  }
}
