import { DELETE, GET, PATCH, Path, PathParam, POST } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { QuizService } from '../service/quizService';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { QuizInput } from '../interface';
import { Quiz } from '../entity/quiz';

@Path('/api/quiz')
export class QuizController {
  @Inject
  private readonly quizService: QuizService;

  @POST
  async createQuiz(input: QuizInput): Promise<DataResponse> {
    return this.quizService.createQuiz(input);
  }

  @GET
  async getAllQuiz(): Promise<Quiz[]> {
    return await this.quizService.getAllQuiz();
  }

  @GET
  @Path(':id')
  async getQuiz(@PathParam('id') id: number): Promise<DataResponse> {
    return this.quizService.getQuiz(id);
  }

  @PATCH
  @Path(':id')
  async updateQuiz(
    @PathParam('id') id: number,
    input: QuizInput
  ): Promise<DataResponse> {
    return this.quizService.updateQuiz(id, input);
  }

  @DELETE
  @Path(':id')
  async deleteQuiz(id: number): Promise<DeleteResponse> {
    return this.quizService.deleteQuiz(id);
  }
}
