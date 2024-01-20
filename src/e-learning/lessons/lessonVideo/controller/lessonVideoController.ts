import { DELETE, GET, PATCH, Path, PathParam, POST } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LessonVideoService } from '../service/lessonVideoService';
import { LessonVideoInput } from '../interface';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonVideo } from '../entity/lessonVideo';

@Path('/api/lesson-videos')
export class LessonVideoController {
  @Inject
  private readonly lessonVideoService: LessonVideoService;

  @POST
  async createLessonVideo(input: LessonVideoInput): Promise<DataResponse> {
    return this.lessonVideoService.createLessonVideo(input);
  }

  @GET
  async getLessonVideos(): Promise<LessonVideo[]> {
    return this.lessonVideoService.getLessonVideos();
  }

  @GET
  @Path(':id')
  async getLessonVideo(@PathParam('id') id: number): Promise<DataResponse> {
    return await this.lessonVideoService.getLessonVideo(id);
  }

  @PATCH
  @Path(':id')
  async updateLessonVideo(
    @PathParam('id') id: number,
    input: LessonVideoInput
  ): Promise<DataResponse> {
    return await this.lessonVideoService.updateLessonVideo(id, input);
  }

  @DELETE
  @Path(':id')
  async deleteLessonVideo(
    @PathParam('id') id: number
  ): Promise<DeleteResponse> {
    return await this.lessonVideoService.deleteLessonVideo(id);
  }
}
