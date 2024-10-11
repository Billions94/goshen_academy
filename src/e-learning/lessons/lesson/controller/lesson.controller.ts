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

  @Get('/:id')
  async getLesson(@Param('id') id: string): Promise<DataResponse<Lesson>> {
    return this.lessonService.findById(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateLesson(
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string,
    @Body() input: Input<Lesson>
  ): Promise<DataResponse<Lesson>> {
    return this.lessonService.update(id, input, authUser);
  }

  @Authorized()
  @Delete('/:id')
  async deleteLesson(
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string
  ): Promise<DeleteResponse> {
    return this.lessonService.deleteById(id, authUser);
  }
}
