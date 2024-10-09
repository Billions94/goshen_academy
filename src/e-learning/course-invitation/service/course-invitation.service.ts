import { NotFoundError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../core/abstract-entity-crud.service';
import { DataResponse } from '../../../e-learning/interfaces/response';
import { Student } from '../../../e-learning/students/entity/student.entity';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Course } from '../../course/entity/course.entity';
import { Input } from '../../interfaces';
import { CourseInvitation } from '../entity/course-invitation.entity';
import { CourseInvitationServiceInterface } from './interface';

interface CourseInvitationWhereArgs extends FindArgs<CourseInvitation> {}

@Service()
export class CourseInvitationService
  extends AbstractEntityCrudService<CourseInvitation, CourseInvitationWhereArgs>
  implements CourseInvitationServiceInterface<Course>
{
  constructor(
    @Inject()
    private readonly courseInvitationRepository: Repository<CourseInvitation>,
    @Inject()
    private readonly courseRepository: Repository<Course>,
    @Inject()
    private readonly errorResponseMapper: ErrorMapper
  ) {
    super(courseInvitationRepository, 'course_invitation', errorResponseMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<CourseInvitation>,
    authUser: Student
  ): void {
    if (!authUser) {
      this.errorResponseMapper.throw(
        'Unauthorized access to course invitation',
        403
      );
      return;
    }

    queryBuilder.where('course_invitation."courseId" IN (:...courseIds)', {
      courseIds: authUser.courses.map((course) => course.id),
    });
  }
  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<CourseInvitation>,
    args: CourseInvitationWhereArgs
  ): void {
    if (args?.where?.email) {
      queryBuilder.andWhere('course_invitation."email" = :email', {
        email: args.where.email,
      });
    }

    if (args?.where?.course?.id) {
      queryBuilder.andWhere('course_invitation."courseId" = :courseId', {
        courseId: args.where.course.id,
      });
    }

    if (args?.where?.isAccepted) {
      queryBuilder.andWhere('course_invitation."isAccepted" = :isAccepted', {
        isAccepted: args.where.isAccepted,
      });
    }
    if (args?.where?.id) {
      queryBuilder.andWhere('course_invitation."id" = :id', {
        id: args.where.id,
      });
    }
    if (args?.authUser) {
      this.addAuthorizedUserCondition(queryBuilder, args.authUser);
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<CourseInvitation>,
    args?: CourseInvitationWhereArgs | undefined
  ): void {
    if (args?.where?.course?.id) {
      queryBuilder.orderBy('course_invitation."courseId"', 'ASC');
    }

    if (args?.where?.createdAt) {
      queryBuilder.addOrderBy('course_invitation."createdAt"', 'ASC');
    }
  }

  public async create(
    input: Input<CourseInvitation>,
    authUser?: Student
  ): Promise<DataResponse<CourseInvitation>> {
    if (!authUser) {
      return this.errorResponseMapper.throw(
        'Unauthorized access to create course invitation',
        401
      );
    }

    const course = await this.courseRepository.findOne({
      where: { id: input.course.id },
    });

    const existingInvitation = await this.courseInvitationRepository.findOne({
      where: { email: input.email, id: input.course.id },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (existingInvitation) {
      return this.errorResponseMapper.throw('Invitation already exists', 409);
    }

    const invitation = this.courseInvitationRepository.create({
      email: input.email,
      course,
    });

    await this.courseInvitationRepository.save(invitation);
    return { status: 201, data: { invitation } };
  }

  public async acceptInvitation(
    invitationId: string,
    input: Input<CourseInvitation>,
    authUser?: Student
  ) {
    if (!authUser) {
      return this.errorResponseMapper.throw(
        'Unauthorized access to accept invitation',
        401
      );
    }

    const invitation = await this.courseInvitationRepository.findOne({
      where: { id: invitationId },
      relations: ['course'],
    });

    if (!invitation || invitation.email !== input.email) {
      return this.errorResponseMapper.throw('Invalid invitation or email');
    }

    invitation.isAccepted = true;
    await this.courseInvitationRepository.save(invitation);
    return {
      message: 'Invitation accepted successfully',
      course: invitation.course,
    };
  }

  public async update(
    id: string,
    input: Input<CourseInvitation>,
    authUser?: Student
  ): Promise<DataResponse<CourseInvitation>> {
    if (!authUser) {
      return this.errorResponseMapper.throw(
        'Unauthorized access to update course invitation',
        401
      );
    }

    const invitation = await this.courseInvitationRepository.findOne({
      where: { id },
    });

    if (!invitation) {
      return this.errorResponseMapper.throw('Invitation not found', 404);
    }

    invitation.isValid = input.isValid;
    await this.courseInvitationRepository.save(invitation);
    return { status: 200, data: { invitation } };
  }
}
