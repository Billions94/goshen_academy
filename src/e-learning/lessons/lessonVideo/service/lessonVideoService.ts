import { Service } from 'typedi';
import { LessonVideoInterface } from './interface';
import { Inject } from 'typescript-ioc';
import { LessonVideoRepository } from '../repository/lessonVideoRepository';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonVideo } from '../entity/lessonVideo';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import Logger from '../../../../utils/logger/logger';
import { LessonVideoInput } from '../interface';

@Service()
export class LessonVideoService implements LessonVideoInterface {
  @Inject
  private readonly lessonVideoRepository: LessonVideoRepository;
  @Inject
  private readonly errorResponseMapper: ErrorMapper;

  async createLessonVideo(input: LessonVideoInput): Promise<DataResponse> {
    try {
      const newLessonVideo = this.lessonVideoRepository.create(input);
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
      const lessonVideo = this.lessonVideoRepository.getById(id);
      return { status: 200, data: { lessonVideo } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async updateLessonVideo(
    id: number,
    input: LessonVideoInput
  ): Promise<DataResponse> {
    try {
      await this.lessonVideoRepository.update(id, input);
      const lessonVideo = this.lessonVideoRepository.getById(id);

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
