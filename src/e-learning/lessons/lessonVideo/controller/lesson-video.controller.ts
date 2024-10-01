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
import { MulterFile, multerOptions } from '../../../../utils/config/options';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Student } from '../../../students/entity/student.entity';
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
    @CurrentUser() authUser: Student,
    @Body() input: LessonVideoInput
  ): Promise<DataResponse<LessonVideo>> {
    return this.lessonVideoService.create(
      {
        ...input,
        url: video.path,
      },
      authUser
    );
  }

  @Get()
  async getLessonVideos(): Promise<LessonVideo[]> {
    return this.lessonVideoService.getLessonVideos();
  }

  @Get('/:id')
  async getLessonVideo(
    @Param('id') id: string
  ): Promise<DataResponse<LessonVideo>> {
    return await this.lessonVideoService.findById(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateLessonVideo(
    @Param('id') id: string,
    @UploadedFile('video', { options: multerOptions() }) video: MulterFile,
    @Body() input: LessonVideoInput
  ): Promise<DataResponse<LessonVideo>> {
    return await this.lessonVideoService.update(id, {
      ...input,
      url: video.path,
    });
  }

  @Authorized()
  @Delete('/:id')
  async deleteLessonVideo(@Param('id') id: string): Promise<DeleteResponse> {
    return await this.lessonVideoService.deleteById(id);
  }
}
