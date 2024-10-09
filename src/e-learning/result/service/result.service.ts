import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import {
  AbstractEntityCrudService,
  FindArgs,
  MessageStatus,
} from '../../../core/abstract-entity-crud.service';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Input, Order, Pagination, Paging } from '../../interfaces';
import { Data, DataResponse } from '../../interfaces/response';
import { Student } from '../../students/entity/student.entity';
import { Result } from '../entity/result.entity';
import { ResultRepository } from '../repository/result.repository';
import { ResultServiceInterface } from './interface';

interface ResultServiceWhereArgs extends FindArgs<Result> {
  where?: Omit<Result, 'student' | 'quiz'>;
}

@Service()
export class ResultService
  extends AbstractEntityCrudService<Result, ResultServiceWhereArgs>
  implements ResultServiceInterface<Result>
{
  constructor(
    @Inject()
    private readonly resultRepository: ResultRepository,
    @Inject()
    private readonly errorResponseMapper: ErrorMapper
  ) {
    super(resultRepository, 'result', errorResponseMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Result>,
    authUser: Student
  ): void {
    if (authUser) {
      if (authUser.isAdmin) {
        queryBuilder.andWhere('result."student_id" = :student_id', {
          student_id: authUser.id,
        });

        return;
      } else {
        queryBuilder.andWhere('student."id" = :id', {
          id: authUser.id,
        });
        queryBuilder.select('student.*');
        return;
      }
    }

    this.errorResponseMapper.throw('Unauthorized access to result', 403);
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Result>,
    args: ResultServiceWhereArgs
  ): void {
    if (!args?.authUser) {
      this.errorResponseMapper.throw('Unauthorized access to result', 403);
    }

    // If the user is not an admin, restrict access to their own results
    if (!args?.authUser?.isAdmin) {
      queryBuilder.andWhere('result."student_id" = :student_id', {
        studentId: args.authUser?.id,
      });
    }

    if (args?.where?.id) {
      queryBuilder.andWhere('result."id" = :id', {
        id: args.where.id,
      });
    }

    if (args?.where?.date) {
      queryBuilder.andWhere('result."date" = :date', {
        date: args.where.date,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Result>,
    args?: ResultServiceWhereArgs
  ): void {
    queryBuilder.orderBy(
      args?.order?.key || 'result.date',
      args?.order?.value || 'DESC'
    );
  }

  public async create(
    input: Input<Result>,
    authUser?: Student
  ): Promise<DataResponse<Result>> {
    try {
      if (!authUser) {
        return this.errorResponseMapper.throw(
          'Unauthorized access to create result',
          403
        );
      }

      // Todo: Implement validation and create result based on the authUser.
      const newResult = this.resultRepository.create(input);
      await this.resultRepository.save(newResult);
      const result = { id: newResult.id };

      return { status: 201, data: { result } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async createMany(
    input: Input<Result>[],
    authUser?: Student
  ): Promise<DataResponse<Result[]>> {
    try {
      if (!authUser) {
        return this.errorResponseMapper.throw(
          'Unauthorized access to create result',
          403
        );
      }

      const results = await Promise.all(
        input.map(async (resultInput) => {
          return await this.create({ ...resultInput }, authUser);
        })
      );

      const data: Data<Result[]> = results.reduce((acc, _result, _index) => {
        //acc[`result_${index}`] = result;
        return acc;
      }, {} as Data<Result[]>);

      return { status: 200, data };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  public async getQuizzesAndCount(
    { limit, page }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Result[]>> {
    try {
      const [results, count] = await this.findManyAndCount({
        pagination: { page: Number(page), limit: Number(limit) },
        order,
        where,
      });

      return {
        ...{ page: Number(page), limit: Number(limit) },
        results,
        pageCount: Math.ceil(count / 10),
        total: count,
      };
    } catch ({ message }) {
      Logger.error(message);
      return {
        page: 0,
        limit: 0,
        results: [],
        pageCount: 0,
        total: 0,
      };
    }
  }

  public async update(
    id: string,
    input: Input<Result>,
    authUser?: Student
  ): Promise<DataResponse<Result>> {
    try {
      if (!authUser) {
        return this.errorResponseMapper.throw(
          'Unauthorized access to update result',
          403
        );
      }

      // Todo: Implement validation and update result based on the authUser.
      await this.resultRepository.update(id, input);
      const updateResult = await this.resultRepository.getById(id);

      return { status: 203, data: { updateResult } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  deleteMany(entities: Result[]): Promise<MessageStatus> {
    throw new Error('Method not implemented.');
  }
}
