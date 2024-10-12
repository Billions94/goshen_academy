import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthUser } from '../../../../auth/interface';
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
    @CurrentUser() authUser: AuthUser,
    @Body() input: LessonCategoryInput
  ): Promise<DataResponse<LessonCategory>> {
    return this.lessonCategoryService.create(input, authUser);
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
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string,
    @Body() input: LessonCategoryInput
  ): Promise<DataResponse<LessonCategory>> {
    return this.lessonCategoryService.update(id, input, authUser);
  }

  @Authorized()
  @Delete('/:id')
  async deleteLesson(
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string
  ): Promise<DeleteResponse> {
    return this.lessonCategoryService.deleteById(id, authUser);
  }
}
