import { Service } from 'typedi';
import { QuizServiceInterface } from './interface';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Quiz } from '../entity/quiz';
import Logger from '../../../utils/logger/logger';
import { Inject } from 'typescript-ioc';
import { QuizRepository } from '../repository/quizRepository';
import { QuizInput } from '../interface';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';

@Service()
export class QuizService implements QuizServiceInterface {
  @Inject
  private readonly quizRepository: QuizRepository;
  @Inject
  private readonly errorResponseMapper: ErrorMapper;

  async createQuiz(input: QuizInput): Promise<DataResponse> {
    try {
      const newQuiz = this.quizRepository.create(input);
      await this.quizRepository.save(newQuiz);
      const quizId = newQuiz.id;

      return { status: 201, data: { quizId } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async getAllQuiz(): Promise<Quiz[]> {
    return this.quizRepository.find();
  }

  async getQuiz(id: number): Promise<DataResponse> {
    try {
      const quiz = await this.quizRepository.getById(id);

      return { status: 200, data: { quiz } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async updateQuiz(id: number, input: QuizInput): Promise<DataResponse> {
    try {
      await this.quizRepository.update(id, input);
      const updatedQuiz = await this.quizRepository.getById(id);

      return { status: 203, data: { updatedQuiz } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async deleteQuiz(id: number): Promise<DeleteResponse> {
    try {
      await this.quizRepository.delete(id);
      return { status: 'success' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }
}
