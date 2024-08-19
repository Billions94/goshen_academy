import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { LessonCategoryInput } from '../../lessonCategory/interface';
import { LessonCategory } from '../entity/lessonCategory';
import { LessonCategoryService } from '../service/lessonCategoryService';

@Service()
@JsonController('/lesson-categories')
export class LessonCategoryController {
  @Inject()
  private readonly categoryService: LessonCategoryService;

  @Authorized()
  @Post()
  async createLesson(
    @Body() input: LessonCategoryInput
  ): Promise<DataResponse> {
    return this.categoryService.createLessonCategory(input);
  }

  @Get()
  async getLessonCategories(): Promise<LessonCategory[]> {
    return this.categoryService.getLessonCategories();
  }

  @Get('/:id')
  async getLessonCategory(@Param('id') id: number): Promise<DataResponse> {
    return this.categoryService.getLessonCategory(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateLesson(
    @Param('id') id: number,
    @Body() input: LessonCategoryInput
  ): Promise<DataResponse> {
    return this.categoryService.updateLessonCategory(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteLesson(@Param('id') id: number): Promise<DeleteResponse> {
    return this.categoryService.deleteLessonCategory(id);
  }
}
