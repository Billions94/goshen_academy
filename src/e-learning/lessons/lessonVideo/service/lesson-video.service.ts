import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../../../../auth/interface';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../../core/abstract-entity-crud.service';
import Logger from '../../../../utils/logger/logger';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import { Input } from '../../../interfaces';
import { DataResponse } from '../../../interfaces/response';
import { LessonVideo } from '../entity/lesson-video.entity';
import { LessonVideoRepository } from '../repository/lesson-video.repository';
import { LessonVideoInterface } from './interface';

interface LessonVideoServiceArgs extends FindArgs<LessonVideo> {}

@Service()
export class LessonVideoService
  extends AbstractEntityCrudService<LessonVideo, LessonVideoServiceArgs>
  implements LessonVideoInterface
{
  constructor(
    @Inject()
    private readonly lessonVideoRepository: LessonVideoRepository,
    @Inject()
    private readonly errorResponseMapper: ErrorMapper
  ) {
    super(lessonVideoRepository, 'lesson_video', errorResponseMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<LessonVideo>,
    authUser: AuthUser
  ): void {
    if (authUser && authUser.isAdmin) {
      queryBuilder.andWhere('lesson_video."isAdmin" = true');
      return;
    }

    throw this.errorResponseMapper.throw(
      'Unauthorized access to lesson_video',
      403
    );
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<LessonVideo>,
    args: LessonVideoServiceArgs
  ): void {
    if (args?.where?.lesson?.id) {
      queryBuilder.andWhere('lesson_video."lessonId" = :lessonId', {
        lessonId: args.where.lesson.id,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<LessonVideo>,
    args?: LessonVideoServiceArgs | undefined
  ): void {
    if (args?.where?.createdAt) {
      queryBuilder.orderBy('lesson_video."createdAt"', 'ASC');
    }
  }

  public async create(
    input: Input<LessonVideo>,
    authUser?: AuthUser
  ): Promise<DataResponse<LessonVideo>> {
    try {
      if (!authUser?.isAdmin) {
        throw this.errorResponseMapper.throw(
          'Unauthorized access to create lesson_video',
          403
        );
      }

      if (!input.lesson) {
        Logger.error('Lesson is required');
        throw this.errorResponseMapper.throw('Lesson is required', 400);
      }

      const newLessonVideo = this.lessonVideoRepository.create({
        lesson: { id: input.lesson.id },
      });

      if (input.url) {
        newLessonVideo.url = input.url;
      }

      await this.lessonVideoRepository.save(newLessonVideo);
      const lessonVideo = { id: newLessonVideo.id };

      return { status: 201, data: { lessonVideo } };
    } catch ({ message }) {
      return this.errorResponseMapper.throw(message);
    }
  }

  async getLessonVideos(): Promise<LessonVideo[]> {
    return this.lessonVideoRepository.find();
  }

  public async update(
    id: string,
    input: Input<LessonVideo>,
    authUser?: AuthUser
  ): Promise<DataResponse<LessonVideo>> {
    try {
      if (!authUser) {
        throw this.errorResponseMapper.throw(
          'Unauthorized access to create lesson_video',
          403
        );
      }

      const lessonVideo = await this.lessonVideoRepository.updateById(
        id,
        input
      );

      return { status: 203, data: { lessonVideo } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }
}
