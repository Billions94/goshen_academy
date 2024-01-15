import { Service } from 'typedi';
import { LessonServiceInterface } from './interface';
import { LessonInput } from '../../interface';
import { Inject } from 'typescript-ioc';
import { LessonRepository } from '../repository/lessonRepository';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { Lesson } from '../entity/lesson';
import Logger from '../../../../utils/logger/logger';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';

@Service()
export class LessonService implements LessonServiceInterface {
  @Inject
  private readonly lessonRepository: LessonRepository;
  @Inject
  private readonly customErrorResponse: ErrorMapper;

  async createLesson(input: LessonInput): Promise<DataResponse> {
    try {
      const lesson = this.lessonRepository.create(input);
      const lessonId = lesson.id;
      lesson.category = input.category;
      await this.lessonRepository.save(lesson);

      return { status: 201, data: { lessonId } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async getLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async getLesson(id: number): Promise<Lesson> {
    return this.lessonRepository.findById(id);
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
}
