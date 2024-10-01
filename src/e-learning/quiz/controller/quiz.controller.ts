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
import { Quiz } from '../entity/quiz.entity';
import { QuizInput } from '../interface';
import { QuizService } from '../service/quiz.service';

@Service()
@JsonController('/quizzes')
export class QuizController {
  @Inject()
  private readonly quizService: QuizService;

  @Authorized()
  @Post()
  async createQuiz(@Body() input: QuizInput): Promise<DataResponse<Quiz>> {
    return this.quizService.create(input);
  }

  @Get()
  async getAllQuiz(
    @QueryParams() { page, limit, key, value }: Order & Paging
  ): Promise<Pagination<Quiz[]>> {
    return await this.quizService.getQuizzesAndCount(
      { page, limit },
      { key, value }
    );
  }

  @Get('/:id')
  async getQuiz(@Param('id') id: string): Promise<DataResponse<Quiz>> {
    return this.quizService.findById(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateQuiz(
    @Param('id') id: string,
    @Body() input: QuizInput
  ): Promise<DataResponse<Quiz>> {
    return this.quizService.update(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteQuiz(@Param('id') id: string): Promise<DeleteResponse> {
    return this.quizService.deleteById(id);
  }
}
