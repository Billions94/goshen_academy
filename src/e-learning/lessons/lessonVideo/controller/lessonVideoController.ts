import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  UploadedFile,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { MulterFile, multerOptions } from '../../../../utils/config/options';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { LessonVideo } from '../entity/lessonVideo';
import { LessonVideoInput } from '../interface';
import { LessonVideoService } from '../service/lessonVideoService';

@Service()
@JsonController('/lesson-videos')
export class LessonVideoController {
  @Inject()
  private readonly lessonVideoService: LessonVideoService;

  @Authorized()
  @Post()
  async createLessonVideo(
    @UploadedFile('video', { options: multerOptions() }) video: MulterFile,
    @Body() input: LessonVideoInput
  ): Promise<DataResponse> {
    return this.lessonVideoService.createLessonVideo(input, video);
  }

  @Get()
  async getLessonVideos(): Promise<LessonVideo[]> {
    return this.lessonVideoService.getLessonVideos();
  }

  @Get('/:id')
  async getLessonVideo(@Param('id') id: number): Promise<DataResponse> {
    return await this.lessonVideoService.getLessonVideo(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateLessonVideo(
    @Param('id') id: number,
    @UploadedFile('video', { options: multerOptions() }) video: MulterFile,
    @Body() input: LessonVideoInput
  ): Promise<DataResponse> {
    return await this.lessonVideoService.updateLessonVideo(id, input, video);
  }

  @Authorized()
  @Delete('/:id')
  async deleteLessonVideo(@Param('id') id: number): Promise<DeleteResponse> {
    return await this.lessonVideoService.deleteLessonVideo(id);
  }
}
