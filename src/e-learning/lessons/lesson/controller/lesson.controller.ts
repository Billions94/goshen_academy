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
  QueryParams,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthUser } from '../../../../auth/interface';
import {
  Input,
  Order,
  Pagination,
  Paging,
} from '../../../../e-learning/interfaces';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Lesson } from '../entity/lesson.entity';
import { LessonService } from '../service/lesson.service';

@Service()
@JsonController('/lessons')
export class LessonController {
  @Inject()
  private readonly lessonService: LessonService;

  @Authorized()
  @Post()
  async createLesson(
    @CurrentUser() authUser: AuthUser,
    @Body() input: Input<Lesson>
  ): Promise<DataResponse<Lesson>> {
    return this.lessonService.create(input, authUser);
  }

  @Get()
  async getLessons(
    @QueryParams()
    {
      page,
      limit,
      key = 'lesson.id',
      value = 'ASC',
      ...restParams
    }: Order & Paging
  ): Promise<Partial<Pagination<Lesson[]>>> {
    return this.lessonService.getLessonsAndCount(
      { page, limit },
      { key, value },
      restParams
    );
  }

  @Get('/:lessonId')
  async getLesson(
    @Param('lessonId') lessonId: string
  ): Promise<DataResponse<Lesson>> {
    return this.lessonService.findById(lessonId);
  }

  @Authorized()
  @Patch('/:lessonId')
  async updateLesson(
    @CurrentUser() authUser: AuthUser,
    @Param('lessonId') lessonId: string,
    @Body() input: Input<Lesson>
  ): Promise<DataResponse<Lesson>> {
    return this.lessonService.update(lessonId, input, authUser);
  }

  @Authorized()
  @Delete('/:lessonId')
  async deleteLesson(
    @CurrentUser() authUser: AuthUser,
    @Param('lessonId') lessonId: string
  ): Promise<DeleteResponse> {
    return this.lessonService.deleteById(lessonId, authUser);
  }
}
