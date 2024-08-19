import { Inject, Service } from 'typedi';
import { Order, Pagination, Paging } from '../../../e-learning/interfaces';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { QuizInput } from '../interface';
import { QuizRepository } from '../repository/quizRepository';
import { QuizServiceInterface } from './interface';

@Service()
export class QuizService implements QuizServiceInterface {
  @Inject()
  private readonly quizRepository: QuizRepository;
  @Inject()
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

  async getAllQuiz(query?: Paging, order?: Order): Promise<Pagination> {
    try {
      if (query?.limit && query.page && order?.key && order?.value) {
        const { limit, page } = query;

        return {
          limit: limit,
          page: page,
          results: await this.mapQuizzes({ query, order }),
        };
      } else {
        return {
          limit: 0,
          page: 0,
          results: await this.mapQuizzes(),
        };
      }
    } catch ({ message }) {
      Logger.error(message);
      return {
        limit: 0,
        page: 0,
        results: [],
      };
    }
  }

  async mapQuizzes(options?: { query: Paging; order: Order }) {
    return options
      ? await this.quizRepository.getQuizzesAndPaginate(
          {
            key: options.order.key,
            value: options.order.value,
          },
          options.query.limit,
          options.query.page
        )
      : await this.quizRepository.find();
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

  async updateQuiz(
    id: number,
    input: Partial<QuizInput>
  ): Promise<DataResponse> {
    try {
      await this.quizRepository.update(id, input);
      const updatedQuiz = await this.quizRepository.updateQuiz(id, input);

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
