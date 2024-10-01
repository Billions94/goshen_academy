import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../core/abstract-entity-crud.service';
import {
  Input,
  Order,
  Pagination,
  Paging,
} from '../../../e-learning/interfaces';
import { DataResponse } from '../../../e-learning/interfaces/response';
import { Student } from '../../../e-learning/students/entity/student.entity';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Validator } from '../../../utils/validator/validator';
import { Course } from '../entity/course.entity';
import { CourseRepository } from '../repository/course.repository';
import { CourseServiceInterface } from './interface';

interface CourseServiceWhereArgs extends FindArgs<Course> {
  where?: Omit<Course, 'lessons'>;
}

@Service()
export class CourseService
  extends AbstractEntityCrudService<Course, CourseServiceWhereArgs>
  implements CourseServiceInterface
{
  constructor(
    @Inject()
    private readonly courseRepository: CourseRepository,
    @Inject()
    private readonly errorResponseMapper: ErrorMapper
  ) {
    super(courseRepository, 'course', errorResponseMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Course>,
    authUser: Student
  ): void {
    queryBuilder.andWhere('course.studentId = :studentId', {
      studentId: authUser.id,
    });
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Course>,
    args: CourseServiceWhereArgs
  ): void {
    if (args.where?.id) {
      queryBuilder.andWhere('course.id = :id', { id: args.where.id });
    }

    if (args.where?.title) {
      queryBuilder.andWhere('course.title LIKE :title', {
        name: `%${args.where.title}%`,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Course>,
    args?: CourseServiceWhereArgs
  ): void {
    if (args?.order) {
      const { key, value } = args.order;
      queryBuilder.orderBy(`course."${key}"` || 'course.id', value || 'ASC');
    }
  }

  public async create(
    input: Input<Course>,
    authUser?: Student
  ): Promise<DataResponse<Course>> {
    if (!authUser) {
      return this.errorResponseMapper.throw(
        'Unauthorized access to create course',
        401
      );
    }
    Validator.validateCourseInput(input);

    const existingCourse = await this.courseRepository.findOne({
      where: { title: input.title },
    });

    if (existingCourse) {
      return this.errorResponseMapper.throw('Course already exists', 409);
    }

    const course = this.courseRepository.create(input);
    course.students = [authUser];

    await this.courseRepository.save(course);
    const newCourse = { id: course.id };

    return { status: 201, data: { newCourse } };
  }

  async getCoursesAndCount(
    { page, limit }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Course[]>> {
    try {
      if (!page && !limit) {
        page = 1;
        limit = 10;
      }

      if (!order?.key && !order?.value) {
        order = { key: 'createdAt', value: 'DESC' };
      }

      const pagination = { page: Number(page), limit: Number(limit) };
      const [results, count] = await this.findManyAndCount({
        pagination,
        order,
        where,
      });

      return {
        ...pagination,
        results,
        pageCount: Math.ceil(count / pagination.limit),
      };
    } catch ({ message }) {
      Logger.error(message);
      return {
        page: 0,
        limit: 0,
        results: [],
        pageCount: 0,
      };
    }
  }

  public async update(
    id: string,
    input: Input<Course>,
    authUser?: Student
  ): Promise<DataResponse<Course>> {
    if (!authUser) {
      return this.errorResponseMapper.throw(
        'Unauthorized access to update course',
        401
      );
    }

    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      return this.errorResponseMapper.throw('Course not found', 404);
    }

    await this.courseRepository.update(id, input);
    const updatedCourse = await this.courseRepository.findOne({
      where: { id },
    });

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return { status: 203, data: { updatedCourse } };
  }
}
