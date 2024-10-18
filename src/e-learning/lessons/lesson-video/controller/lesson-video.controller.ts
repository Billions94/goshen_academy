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
  UploadedFile,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthUser } from '../../../../auth/interface';
import { MulterFile, multerOptions } from '../../../../utils/config/options';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { LessonVideo } from '../entity/lesson-video.entity';
import { LessonVideoInput } from '../interface';
import { LessonVideoService } from '../service/lesson-video.service';

@Service()
@JsonController('/lesson-videos')
export class LessonVideoController {
  @Inject()
  private readonly lessonVideoService: LessonVideoService;

  @Authorized()
  @Post()
  async createLessonVideo(
    @UploadedFile('video', { options: multerOptions() }) video: MulterFile,
    @CurrentUser() authUser: AuthUser,
    @Body() input: LessonVideoInput
  ): Promise<DataResponse<LessonVideo>> {
    return this.lessonVideoService.create(
      { ...input, url: video.path },
      authUser
    );
  }

  @Get()
  async getLessonVideos(): Promise<LessonVideo[]> {
    return this.lessonVideoService.getLessonVideos();
  }

  @Get('/:lessonVideoId')
  async getLessonVideo(
    @Param('lessonVideoId') lessonVideoId: string
  ): Promise<DataResponse<LessonVideo>> {
    return await this.lessonVideoService.findById(lessonVideoId);
  }

  @Authorized()
  @Patch('/:lessonVideoId')
  async updateLessonVideo(
    @CurrentUser() authUser: AuthUser,
    @Param('lessonVideoId') lessonVideoId: string,
    @UploadedFile('video', { options: multerOptions() }) video: MulterFile,
    @Body() input: LessonVideoInput
  ): Promise<DataResponse<LessonVideo>> {
    return await this.lessonVideoService.update(
      lessonVideoId,
      {
        ...input,
        url: video.path,
      },
      authUser
    );
  }

  @Authorized()
  @Delete('/:lessonVideoId')
  async deleteLessonVideo(
    @CurrentUser() authUser: AuthUser,
    @Param('lessonVideoId') lessonVideoId: string
  ): Promise<DeleteResponse> {
    return await this.lessonVideoService.deleteById(lessonVideoId, authUser);
  }
}
