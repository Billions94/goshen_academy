import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Order, Pagination, Paging } from '../../../../e-learning/interfaces';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { LessonInput } from '../interface';
import { LessonService } from '../service/lessonService';

@Service()
@JsonController('/lessons')
export class LessonController {
  @Inject()
  private readonly lessonService: LessonService;

  @Authorized()
  @Post()
  async createLesson(@Body() input: LessonInput): Promise<DataResponse> {
    return this.lessonService.createLesson(input);
  }

  @Get()
  async getLessons(
    @QueryParams() params: Order & Paging
  ): Promise<Partial<Pagination>> {
    const { page, limit, key = 'lesson.id', value = 'ASC' } = params;
    return this.lessonService.getLessons({ page, limit }, { key, value });
  }

  @Get('/:id')
  async getLesson(@Param('id') id: number): Promise<DataResponse> {
    return this.lessonService.getLesson(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateLesson(
    @Param('id') id: number,
    @Body() input: LessonInput
  ): Promise<DataResponse> {
    return this.lessonService.updateLesson(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteLesson(@Param('id') id: number): Promise<DeleteResponse> {
    return this.lessonService.deleteLesson(id);
  }
}
