import { DELETE, GET, PATCH, Path, PathParam, POST } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LessonService } from '../service/lessonService';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonInput } from '../../interface';
import { Lesson } from '../entity/lesson';

@Path('api/lessons')
export class LessonController {
  @Inject
  private readonly lessonService: LessonService;

  @POST
  async createLesson(input: LessonInput): Promise<DataResponse> {
    return this.lessonService.createLesson(input);
  }

  @GET
  async getLessons(): Promise<Lesson[]> {
    return this.lessonService.getLessons();
  }

  @GET
  @Path(':id')
  async getLesson(@PathParam('id') id: number): Promise<Lesson> {
    return this.lessonService.getLesson(id);
  }

  @PATCH
  @Path(':id')
  async updateLesson(
    @PathParam('id') id: number,
    input: LessonInput
  ): Promise<DataResponse> {
    return this.lessonService.updateLesson(id, input);
  }

  @DELETE
  async deleteLesson(@PathParam('id') id: number): Promise<DeleteResponse> {
    return this.lessonService.deleteLesson(id);
  }
}
