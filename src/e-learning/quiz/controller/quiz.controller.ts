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
import { AuthUser } from '../../../auth/interface';
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
  async createQuiz(
    @CurrentUser() authUser: AuthUser,
    @Body() input: QuizInput
  ): Promise<DataResponse<Quiz>> {
    return this.quizService.create(input, authUser);
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
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string,
    @Body() input: QuizInput
  ): Promise<DataResponse<Quiz>> {
    return this.quizService.update(id, input, authUser);
  }

  @Authorized()
  @Delete('/:id')
  async deleteQuiz(
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string
  ): Promise<DeleteResponse> {
    return this.quizService.deleteById(id, authUser);
  }
}
