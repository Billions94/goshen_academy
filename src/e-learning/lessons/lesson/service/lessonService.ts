import { Inject, Service } from 'typedi';
import { Order, Pagination, Paging } from '../../../../e-learning/interfaces';
import { Student } from '../../../../e-learning/students/entity/student';
import { StudentRepository } from '../../../../e-learning/students/repository/studentRepository';
import Logger from '../../../../utils/logger/logger';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { lessonResponseMapper } from '../../lessonVideo/mapper/lessonMapper';
import { Lesson } from '../entity/lesson';
import { LessonInput } from '../interface';
import { LessonRepository } from '../repository/lessonRepository';
import { LessonServiceInterface } from './interface';

@Service()
export class LessonService implements LessonServiceInterface {
  @Inject()
  private readonly lessonRepository: LessonRepository;
  @Inject()
  private readonly studentRepository: StudentRepository;
  @Inject()
  private readonly customErrorResponse: ErrorMapper;

  async createLesson(input: LessonInput): Promise<DataResponse> {
    try {
      const student = await this.getStudentFromLesson(input.studentIds);
      const lesson = this.lessonRepository.create(input);
      lesson.students = [student];

      await this.lessonRepository.save(lesson);
      const lessonId = lesson.id;

      return { status: 201, data: { lessonId } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async getLessons(
    query?: Paging,
    order?: Order
  ): Promise<Partial<Pagination>> {
    try {
      if (query?.limit && query.page && order?.key && order?.value) {
        const { limit, page } = query;

        return {
          limit: limit,
          page: page,
          results: await this.mapLessons({ query, order }),
        };
      } else {
        return {
          limit: 0,
          page: 0,
          results: await this.mapLessons(),
        };
      }
    } catch ({ message }) {
      Logger.error(message);
      return {
        limit: 0,
        page: 0,
        results: [],
      };
    }
  }

  async mapLessons(options?: {
    query: Paging;
    order: Order;
  }): Promise<Lesson[]> {
    return options
      ? await this.lessonRepository
          .getLessonsAndPaginate(
            {
              key: options.order.key,
              value: options.order.value,
            },
            options.query.limit,
            options.query.page
          )
          .then((lessons) => lessons.map(lessonResponseMapper) as Lesson[])
      : await this.lessonRepository
          .find()
          .then((lessons) => lessons.map(lessonResponseMapper) as Lesson[]);
  }

  async getLesson(id: number): Promise<DataResponse> {
    try {
      const lesson = await this.lessonRepository.findById(id);

      if (!lesson) {
        return {
          status: 404,
          data: null,
          error: {
            message: `Lesson with id ${id} not found`,
          },
        };
      }

      return { status: 200, data: { lesson } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async updateLesson(id: number, input: LessonInput): Promise<DataResponse> {
    try {
      await this.lessonRepository.update(id, input);
      const lesson = await this.lessonRepository.findById(id);

      return { status: 203, data: { lesson } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async deleteLesson(id: number): Promise<DeleteResponse> {
    try {
      await this.lessonRepository.deleteById(id);
      return { status: 'success' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }

  async getStudentFromLesson(
    studentIds: number | number[]
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
