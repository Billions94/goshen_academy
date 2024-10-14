import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../auth/interface';
import { Input, Order, Pagination } from '../e-learning/interfaces';
import { DataResponse } from '../e-learning/interfaces/response';
import { Student } from '../e-learning/students/entity/student.entity';
import Logger from '../utils/logger/logger';
import { ErrorMapper } from '../utils/mapper/errorMapper';

export interface FindArgs<Entity> {
  where?: Partial<Entity> & {
    relations?: string[];
  };
  authUser?: Student;
  pagination?: Omit<Pagination<Entity>, 'results' | 'pageCount'>;
  order?: Order;
}

export interface MessageStatus {
  status: 'failed' | 'success';
}

export abstract class AbstractEntityCrudService<
  Entity extends ObjectLiteral,
  AbstractArgs extends FindArgs<Entity>
> {
  constructor(
    private readonly repository: Repository<Entity>,
    private readonly alias: string,
    private readonly errorFn: ErrorMapper
  ) {}

  NOT_FOUND_ERROR =
    this.alias.slice(0, 1).toUpperCase() +
    this.alias.slice(1, this.alias.length) +
    ' not found.';

  /**
   * Abstract method to add authorization-specific conditions to the query builder.
   * This method should be implemented in child classes to apply necessary conditions based on the authenticated user.
   *
   * @param queryBuilder - The TypeORM SelectQueryBuilder instance to apply conditions to.
   * @param authUser - The authenticated user object.
   *
   * @returns {void} - The method does not return a value.
   *
   * @abstract
   */
  protected abstract addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Entity>,
    authUser: AuthUser
  ): void;

  /**
   * Abstract method to add where conditions to the query builder based on the provided arguments.
   * This method should be implemented in child classes to apply necessary conditions based on the input parameters.
   *
   * @param queryBuilder - The TypeORM SelectQueryBuilder instance to apply conditions to.
   * @param args - The arguments object containing the conditions to be applied.
   *
   * @returns {void} - The method does not return a value.
   *
   * @abstract
   */
  protected abstract addWhereCondition(
    queryBuilder: SelectQueryBuilder<Entity>,
    args: AbstractArgs
  ): void;

  /**
   * Abstract method to add order by clause to the query builder based on the provided arguments.
   * This method should be implemented in child classes to apply necessary order by conditions based on the input parameters.
   *
   * @param queryBuilder - The TypeORM SelectQueryBuilder instance to apply order by clause to.
   * @param args - The arguments object containing the order by conditions to be applied.
   *
   * @returns {void} - The method does not return a value.
   *
   * @abstract
   */
  protected abstract addOrderByClause(
    queryBuilder: SelectQueryBuilder<Entity>,
    args?: AbstractArgs
  ): void;

  public abstract create(
    input: Input<Entity>,
    authUser?: AuthUser
  ): Promise<DataResponse<Entity>>;

  public abstract update(
    id: string,
    input: Input<Entity>,
    authUser?: AuthUser
  ): Promise<DataResponse<Entity>>;

  protected addPagination(
    queryBuilder: SelectQueryBuilder<Entity>,
    pagination: Omit<Pagination<Entity>, 'results' | 'pageCount'>
  ): void {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    queryBuilder.take(limit).skip((page - 1) * limit);
  }

  public getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(this.alias);
  }

  protected getFindQueryBuilder(
    args?: AbstractArgs
  ): SelectQueryBuilder<Entity> {
    const queryBuilder = this.getQueryBuilder();

    if (args) {
      this.addWhereCondition(queryBuilder, args);
    }

    if (args?.authUser) {
      this.addAuthorizedUserCondition(queryBuilder, args.authUser);
    }

    if (args?.where?.relations) {
      [...new Set(args.where.relations)].forEach((relation) => {
        let alias = relation;
        let table = relation;
        let baseTable = queryBuilder.alias;

        const levels = relation.split('.');

        if (levels.length) {
          alias = levels[levels.length - 1];
          table = levels[levels.length - 1];
        }

        if (levels.length > 1) {
          baseTable = levels[levels.length - 2];
        }
      });
    }

    return queryBuilder;
  }

  public async findById(
    id: string,
    args?: AbstractArgs
  ): Promise<DataResponse<Entity>> {
    try {
      const item = await this.getFindQueryBuilder(args)
        .andWhere(`"${this.alias}"."id" = :id`, { id })
        .getOne();

      if (!item) {
        throw new Error(this.NOT_FOUND_ERROR);
      }

      return { data: item, status: 200 };
    } catch (e) {
      Logger.error(e.message);
      return this.errorFn.throw(e.message);
    }
  }

  public async findMany(args?: AbstractArgs): Promise<Entity[]> {
    return this.getFindManyQueryBuilder(args).getMany();
  }

  public async findManyAndCount(
    args?: AbstractArgs
  ): Promise<[Entity[], number]> {
    return this.getFindManyQueryBuilder(args).getManyAndCount();
  }

  public async deleteById(
    id: string,
    authUser?: AuthUser
  ): Promise<MessageStatus> {
    try {
      if (!authUser) throw new Error('Auth user is required.');
      if (!this.findById(id)) throw new Error(this.NOT_FOUND_ERROR);

      await this.repository.delete(id);
      return { status: 'success' };
    } catch (error) {
      Logger.warn(error.message);
      return { status: 'failed' };
    }
  }

  protected getFindManyQueryBuilder(
    args?: AbstractArgs
  ): SelectQueryBuilder<Entity> {
    const queryBuilder = this.getFindQueryBuilder(args);

    if (args?.where) this.addWhereCondition(queryBuilder, args);

    if (args?.order) this.addOrderByClause(queryBuilder, args);

    if (args?.pagination) this.addPagination(queryBuilder, args.pagination);

    return queryBuilder;
  }
}
