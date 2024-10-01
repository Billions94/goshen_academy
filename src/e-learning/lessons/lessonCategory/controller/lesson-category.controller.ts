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
import { LessonCategory } from '../entity/lesson-category.entity';
import { LessonCategoryInput } from '../interface';
import { LessonCategoryService } from '../service/lesson-category.service';

@Service()
@JsonController('/lesson-categories')
export class LessonCategoryController {
  @Inject()
  private readonly lessonCategoryService: LessonCategoryService;

  @Authorized()
  @Post()
  async createLesson(
    @Body() input: LessonCategoryInput
  ): Promise<DataResponse<LessonCategory>> {
    return this.lessonCategoryService.create(input);
  }

  @Get()
  async getLessonCategories(): Promise<LessonCategory[]> {
    return this.lessonCategoryService.getLessonCategories();
  }

  @Get('/:id')
  async getLessonCategory(
    @Param('id') id: string
  ): Promise<DataResponse<LessonCategory>> {
    return this.lessonCategoryService.findById(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateLesson(
    @Param('id') id: string,
    @Body() input: LessonCategoryInput
  ): Promise<DataResponse<LessonCategory>> {
    return this.lessonCategoryService.update(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteLesson(@Param('id') id: string): Promise<DeleteResponse> {
    return this.lessonCategoryService.deleteById(id);
  }
}
