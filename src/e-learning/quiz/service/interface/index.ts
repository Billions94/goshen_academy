import { Pagination } from '../../../interfaces';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Quiz } from '../../entity/quiz';
import { QuizInput } from '../../interface';

export interface QuizServiceInterface {
  createQuiz(input: QuizInput): Promise<DataResponse>;

  getAllQuiz(): Promise<Pagination<Partial<Quiz>>>;

  getQuiz(id: number): Promise<DataResponse>;

  updateQuiz(id: number, input: QuizInput): Promise<DataResponse>;

  deleteQuiz(id: number): Promise<DeleteResponse>;
}
