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
import { Order, Pagination, Paging } from '../../../e-learning/interfaces';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { QuizInput } from '../interface';
import { QuizService } from '../service/quizService';

@Service()
@JsonController('/quizzes')
export class QuizController {
  @Inject()
  private readonly quizService: QuizService;

  @Authorized()
  @Post()
  async createQuiz(@Body() input: QuizInput): Promise<DataResponse> {
    return this.quizService.createQuiz(input);
  }

  @Get()
  async getAllQuiz(@QueryParams() params: Order & Paging): Promise<Pagination> {
    const { page, limit, key = 'id', value = 'DESC' } = params;
    return await this.quizService.getAllQuiz({ page, limit }, { key, value });
  }

  @Get('/:id')
  async getQuiz(@Param('id') id: number): Promise<DataResponse> {
    return this.quizService.getQuiz(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateQuiz(
    @Param('id') id: number,
    @Body() input: QuizInput
  ): Promise<DataResponse> {
    return this.quizService.updateQuiz(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteQuiz(@Param('id') id: number): Promise<DeleteResponse> {
    return this.quizService.deleteQuiz(id);
  }
}
