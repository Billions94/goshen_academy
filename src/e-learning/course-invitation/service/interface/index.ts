import { ErrorResponse, Input } from 'src/e-learning/interfaces';
import { Student } from '../../../../e-learning/students/entity/student.entity';
import { CourseInvitation } from '../../entity/course-invitation.entity';

export interface CourseInvitationServiceInterface<Entity> {
  acceptInvitation(
    invitationId: string,
    input: Input<CourseInvitation>,
    authUser?: Student
  ): Promise<
    | ErrorResponse
    | {
        message: string;
        status: boolean;
      }
  >;
}
