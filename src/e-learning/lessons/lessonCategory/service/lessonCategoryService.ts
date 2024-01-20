import { Service } from 'typedi';
import { LessonCategoryServiceInterface } from './interface';
import { Inject } from 'typescript-ioc';
import { LessonCategoryRepository } from '../repository/lessonCategoryRepository';
import { LessonCategoryInput } from '../../interface';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonCategory } from '../entity/lessonCategory';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import Logger from '../../../../utils/logger/logger';

@Service()
export class LessonCategoryService implements LessonCategoryServiceInterface {
  @Inject
  private readonly lessonCategoryRepository: LessonCategoryRepository;
  @Inject
  private readonly customErrorResponse: ErrorMapper;

  async createLessonCategory(
    input: LessonCategoryInput
  ): Promise<DataResponse> {
    try {
      const category = this.lessonCategoryRepository.create(input);
      await this.lessonCategoryRepository.save(category);
      const categoryId = category.id;
      return { status: 200, data: { categoryId } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async getLessonCategories(): Promise<LessonCategory[]> {
    console.log('In here');
    return await this.lessonCategoryRepository.find();
  }

  async getLessonCategory(id: number): Promise<DataResponse> {
    try {
      const category = await this.lessonCategoryRepository.findById(id);
      return { status: 200, data: { category } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async updateLessonCategory(
    id: number,
    input: LessonCategoryInput
  ): Promise<DataResponse> {
    try {
      await this.lessonCategoryRepository.update(id, input);
      const category = this.lessonCategoryRepository.findById(id);

      return { status: 203, data: { category } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async deleteLessonCategory(id: number): Promise<DeleteResponse> {
    try {
      await this.lessonCategoryRepository.delete(id);
      return { status: 'success' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }
}
