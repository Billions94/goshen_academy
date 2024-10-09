import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../../core/abstract-entity-crud.service';
import Logger from '../../../../utils/logger/logger';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import { Input, Order, Pagination, Paging } from '../../../interfaces';
import { DataResponse } from '../../../interfaces/response';
import { Student } from '../../../students/entity/student.entity';
import { StudentRepository } from '../../../students/repository/student.repository';
import { Lesson } from '../entity/lesson.entity';
import { LessonRepository } from '../repository/lesson.repository';
import { LessonServiceInterface } from './interface';

interface LessonWhereArgs extends FindArgs<Lesson> {}

@Service()
export class LessonService
  extends AbstractEntityCrudService<Lesson, LessonWhereArgs>
  implements LessonServiceInterface
{
  constructor(
    @Inject()
    private readonly lessonRepository: LessonRepository,
    @Inject()
    private readonly studentRepository: StudentRepository,
    @Inject()
    private readonly customErrorResponse: ErrorMapper
  ) {
    super(lessonRepository, 'lesson', customErrorResponse);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Lesson>,
    authUser: Student
  ): void {
    if (authUser) {
      if (authUser.isAdmin) {
        queryBuilder
          .select('student', 's')
          .leftJoin('s.student_lessons', 'sl')
          .leftJoin('sl."lesson"', 'l')
          .where('l.id IS NOT NULL')
          .select('l.*')
          .getMany();

        return;
      } else {
        queryBuilder
          .select('student', 's')
          .leftJoin('s.student_lessons', 'sl')
          .leftJoin('sl."lesson"', 'l')
          .where('l.id IS NOT NULL')
          .andWhere('ls."studentId" = :studentId', {
            studentId: authUser.id,
          })
          .select('l.*')
          .getMany();

        return;
      }
    }

    this.customErrorResponse.throw('Unauthorized access to lesson', 403);
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Lesson>,
    args: LessonWhereArgs
  ): void {
    if (args?.where?.id) {
      queryBuilder.andWhere('lesson."id" = :id', {
        id: args.where.id,
      });
    }

    if (args?.where?.name) {
      queryBuilder.andWhere('lesson."name" ILIKE :name', {
        name: `%${args.where.name}%`,
      });
    }

    if (args?.where?.category?.id) {
      queryBuilder.andWhere('lesson."categoryId" = :categoryId', {
        categoryId: args.where.category.id,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Lesson>,
    args?: LessonWhereArgs
  ): void {
    queryBuilder.orderBy(args?.order?.key || 'lesson.id', args?.order?.value);
  }

  public async create(
    input: Input<Lesson & { studentIds?: string | string[] }>,
    authUser?: Student
  ): Promise<DataResponse<Lesson>> {
    try {
      if (!authUser?.isAdmin) {
        return this.customErrorResponse.throw(
          'Unauthorized access to create lesson',
          403
        );
      }

      let student: Student | undefined;

      if (input.studentIds) {
        student = await this.getStudentFromLesson(input?.studentIds);
      } else student = undefined;

      const newLesson = this.lessonRepository.create(input);
      //newLesson.students = [student];

      await this.lessonRepository.save(newLesson);
      const lesson = { id: newLesson.id };

      return { status: 201, data: { lesson } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  public async getLessonsAndCount(
    { page, limit }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Lesson[]>> {
    try {
      if (!order) {
        order = { key: 'lesson.id', value: 'ASC' };
      }

      const pagination = { page: Number(page), limit: Number(limit) };
      const [results, count] = await this.findManyAndCount({
        pagination,
        order,
        where,
      });

      return {
        ...pagination,
        pageCount: Math.ceil(count / Number(limit)),
        results,
        total: count,
      };
    } catch ({ message }) {
      Logger.error(message);
      return {
        limit: 0,
        page: 0,
        pageCount: 0,
        results: [],
        total: 0,
      };
    }
  }

  public async update(
    id: string,
    input: Input<Lesson>,
    authUser?: Student
  ): Promise<DataResponse<Lesson>> {
    try {
      if (!authUser?.isAdmin) {
        return this.customErrorResponse.throw(
          'Unauthorized access to create lesson',
          403
        );
      }

      const lesson = await this.findById(id);
      if (!lesson) {
        return this.customErrorResponse.throw('Lesson not found', 404);
      }

      await this.lessonRepository.update(id, input);
      return await this.findById(id);
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async getStudentFromLesson(
    studentIds: string | string[]
  ): Promise<Student | undefined> {
    let student: Student;

    if (Array.isArray(studentIds)) {
      for (const id of studentIds) {
        student = await this.studentRepository.findById(id);
        return student;
      }
    } else {
      student = await this.studentRepository.findById(studentIds);
      return student;
    }
  }
}
