import {
  Authorized,
  Body,
  CurrentUser,
  JsonController,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Input } from '../../../e-learning/interfaces';
import { Student } from '../../../e-learning/students/entity/student.entity';
import { CourseInvitation } from '../entity/course-invitation.entity';
import { CourseInvitationService } from '../service/course-invitation.service';

@Service()
@JsonController('/course-invitations')
export class CourseInvitationController {
  @Inject()
  private readonly courseInvitationService: CourseInvitationService;

  @Authorized()
  @Post()
  async createCourseInvitation(
    @CurrentUser() authUser: Student,
    @Body() input: Input<CourseInvitation>
  ) {
    return this.courseInvitationService.create(input, authUser);
  }

  @Authorized()
  @Post('/:invitationId/accept')
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
    @Body() input: Input<CourseInvitation>
  ) {
    return this.courseInvitationService.acceptInvitation(invitationId, input);
  }

  @Authorized()
  @Patch('/:invitationId')
  async updateInvitation(
    @CurrentUser() authUser: Student,
    @Param('invitationId') invitationId: string,
    @Body() input: Input<CourseInvitation>
  ) {
    return this.courseInvitationService.update(invitationId, input, authUser);
  }
}
