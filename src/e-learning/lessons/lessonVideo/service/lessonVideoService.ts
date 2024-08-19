import { Inject, Service } from 'typedi';
import { MulterFile } from '../../../../utils/config/options';
import Logger from '../../../../utils/logger/logger';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { LessonVideo } from '../entity/lessonVideo';
import { LessonVideoInput } from '../interface';
import { LessonVideoRepository } from '../repository/lessonVideoRepository';
import { LessonVideoInterface } from './interface';

@Service()
export class LessonVideoService implements LessonVideoInterface {
  @Inject()
  private readonly lessonVideoRepository: LessonVideoRepository;
  @Inject()
  private readonly errorResponseMapper: ErrorMapper;

  async createLessonVideo(
    input: LessonVideoInput,
    video: MulterFile
  ): Promise<DataResponse> {
    try {
      const newLessonVideo = this.lessonVideoRepository.create({
        title: input.title,
        lesson: input.lesson,
        url: video.path ?? input.url,
      });
      await this.lessonVideoRepository.save(newLessonVideo);
      const newLessonVideoId = newLessonVideo.id;

      return { status: 201, data: { newLessonVideoId } };
    } catch ({ message }) {
      return this.errorResponseMapper.throw(message);
    }
  }

  async getLessonVideos(): Promise<LessonVideo[]> {
    return this.lessonVideoRepository.find();
  }

  async getLessonVideo(id: number): Promise<DataResponse> {
    try {
      const lessonVideo = await this.lessonVideoRepository.getById(id);
      return { status: 200, data: { lessonVideo } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async updateLessonVideo(
    id: number,
    input: LessonVideoInput,
    video: MulterFile
  ): Promise<DataResponse> {
    try {
      const lessonVideo = await this.lessonVideoRepository.updateById(
        id,
        input,
        video.path
      );

      return { status: 203, data: { lessonVideo } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async deleteLessonVideo(id: number): Promise<DeleteResponse> {
    try {
      await this.lessonVideoRepository.delete(id);
      return { status: 'success' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }
}
