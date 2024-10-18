import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../../../auth/interface';
import { AbstractEntityCrudService, FindArgs } from '../../../core';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Input, Order, Pagination, Paging } from '../../interfaces';
import { DataResponse } from '../../interfaces/response';
import { Quiz } from '../entity/quiz.entity';
import { QuizRepository } from '../repository/quiz.repository';
import { QuizServiceInterface } from './interface';

interface QuizServiceWhereArgs extends FindArgs<Quiz> {
  where?: Quiz;
}

@Service()
export class QuizService
  extends AbstractEntityCrudService<Quiz, QuizServiceWhereArgs>
  implements QuizServiceInterface
{
  constructor(
    @Inject()
    private readonly quizRepository: QuizRepository,
    @Inject()
    private readonly errorResponseMapper: ErrorMapper
  ) {
    super(quizRepository, 'quiz', errorResponseMapper);
    Logger.info('QuizService initialized');
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Quiz>,
    authUser: AuthUser
  ): void {
    if (authUser && authUser.isAdmin) {
      queryBuilder.andWhere('quiz."isAdmin" = true');
      return;
    }

    this.errorResponseMapper.throw('Unauthorized access to quiz', 403);
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Quiz>,
    args: QuizServiceWhereArgs
  ): void {
    if (args?.where?.id) {
      queryBuilder.andWhere('quiz."id" = :id', {
        id: args.where.id,
      });
    }

    if (args?.where?.question) {
      queryBuilder.andWhere('quiz."question" ILIKE :question', {
        question: `%${args.where.question}%`,
      });
    }

    if (args?.where?.lesson) {
      queryBuilder.andWhere('quiz."lessonId" = :lessonId', {
        lessonId: args.where.lesson.id,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Quiz>,
    args?: QuizServiceWhereArgs
  ): void {
    queryBuilder.orderBy(args?.order?.key || 'quiz.id', args?.order?.value);
  }

  public async create(
    input: Input<Quiz>,
    authUser?: AuthUser
  ): Promise<DataResponse<Quiz>> {
    try {
      if (!authUser) {
        return this.errorResponseMapper.throw(
          'Unauthorized access to create quiz',
          403
        );
      }

      const newQuiz = this.quizRepository.create(input);
      await this.quizRepository.save(newQuiz);
      const quiz = { id: newQuiz.id };

      return { status: 201, data: { quiz } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async getQuizzesAndCount(
    { limit, page }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Quiz[]>> {
    try {
      if (!order?.key && order?.value) {
        order = { key: 'id', value: 'DESC' };
      }

      if (!where) {
        where = {};
      }

      const pagination = { page: Number(page), limit: Number(limit) };
      const [results, count] = await this.findManyAndCount({
        pagination,
        order,
        where,
      });

      return {
        ...pagination,
        pageCount: Math.ceil(count / limit),
        results,
        total: count,
      };
    } catch ({ message }) {
      Logger.error(message);
      return {
        limit: 0,
        page: 0,
        pageCount: 0,
        results: [],
        total: 0,
      };
    }
  }

  public async update(
    id: string,
    input: Input<Quiz>,
    authUser?: AuthUser
  ): Promise<DataResponse<Quiz>> {
    try {
      if (!authUser?.isAdmin) {
        return this.errorResponseMapper.throw(
          'Unauthorized access to create lesson',
          403
        );
      }

      const quiz = await this.quizRepository.findOne({
        where: { id: id },
      });

      if (!quiz) {
        return this.errorResponseMapper.throw('Quiz not found', 404);
      }

      const updatedQuiz = await this.quizRepository.updateQuiz(id, input);

      return { status: 203, data: { updatedQuiz } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }
}
