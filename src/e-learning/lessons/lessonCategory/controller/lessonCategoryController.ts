import { DELETE, GET, PATCH, Path, PathParam, POST } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LessonCategoryService } from '../service/lessonCategoryService';
import { LessonCategoryInput } from '../../interface';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonCategory } from '../entity/lessonCategory';

@Path('api/lessons/lesson-category')
export class LessonCategoryController {
  @Inject
  private readonly categoryService: LessonCategoryService;

  @POST
  async createLesson(input: LessonCategoryInput): Promise<DataResponse> {
    return this.categoryService.createLessonCategory(input);
  }

  @GET
  async getLessonCategories(): Promise<LessonCategory[]> {
    return this.categoryService.getLessonCategories();
  }

  @GET
  @Path(':id')
  async getLessonCategory(@PathParam('id') id: number): Promise<DataResponse> {
    return this.categoryService.getLessonCategory(id);
  }

  @PATCH
  @Path(':id')
  async updateLesson(
    @PathParam('id') id: number,
    input: LessonCategoryInput
  ): Promise<DataResponse> {
    return this.categoryService.updateLessonCategory(id, input);
  }

  @DELETE
  async deleteLesson(@PathParam('id') id: number): Promise<DeleteResponse> {
    return this.categoryService.deleteLessonCategory(id);
  }
}
