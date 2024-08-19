import { Pagination } from '../../../../e-learning/students/interface';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { QuizInput } from '../../interface';

export interface QuizServiceInterface {
  createQuiz(input: QuizInput): Promise<DataResponse>;
  getAllQuiz(): Promise<Pagination>;
  getQuiz(id: number): Promise<DataResponse>;
  updateQuiz(id: number, input: QuizInput): Promise<DataResponse>;
  deleteQuiz(id: number): Promise<DeleteResponse>;
}
