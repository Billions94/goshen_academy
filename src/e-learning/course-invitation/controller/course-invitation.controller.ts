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
import { AuthUser } from '../../../auth/interface';
import { ErrorResponse, Input } from '../../../e-learning/interfaces';
import { DataResponse } from '../../../e-learning/interfaces/response';
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
    @CurrentUser() authUser: AuthUser,
    @Body() input: Input<CourseInvitation>
  ): Promise<DataResponse<CourseInvitation>> {
    return this.courseInvitationService.create(input, authUser);
  }

  @Authorized()
  @Post('/:invitationId/accept')
  async acceptInvitation(
    @CurrentUser() authUser: AuthUser,
    @Param('invitationId') invitationId: string,
    @Body() input: Input<CourseInvitation>
  ): Promise<
    | ErrorResponse
    | {
        message: string;
        status: boolean;
      }
  > {
    return this.courseInvitationService.acceptInvitation(
      invitationId,
      input,
      authUser
    );
  }

  @Authorized()
  @Patch('/:invitationId')
  async updateInvitation(
    @CurrentUser() authUser: AuthUser,
    @Param('invitationId') invitationId: string,
    @Body() input: Input<CourseInvitation>
  ): Promise<DataResponse<CourseInvitation>> {
    return this.courseInvitationService.update(invitationId, input, authUser);
  }

  @Authorized()
  @Patch('/:invitationId/revoke')
  async revokeInvitation(
    @CurrentUser() authUser: AuthUser,
    @Param('invitationId') invitationId: string
  ): Promise<
    | ErrorResponse
    | {
        message: string;
        status: boolean;
      }
  > {
    return this.courseInvitationService.revokeInvitation(
      invitationId,
      authUser
    );
  }
}
