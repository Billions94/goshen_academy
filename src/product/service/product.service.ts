import { Inject, Service } from 'typedi';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../../auth/interface';
import { AbstractEntityCrudService, FindArgs } from '../../core';
import { DataBase } from '../../db/init';
import { Course } from '../../e-learning/course/entity/course.entity';
import { Input } from '../../e-learning/interfaces';
import { DataResponse } from '../../e-learning/interfaces/response';
import Logger from '../../utils/logger/logger';
import { ErrorMapper } from '../../utils/mapper/errorMapper';
import { Product } from '../entity/product.entity';
import { ProductRepository } from '../repository/product.repository';

interface ProductServiceWhereArgs extends FindArgs<Product> {}

@Service()
export class ProductService extends AbstractEntityCrudService<
  Product,
  ProductServiceWhereArgs
> {
  private readonly manager: EntityManager;

  constructor(
    @Inject()
    private readonly productRepository: ProductRepository,
    @Inject()
    private readonly errorMapper: ErrorMapper
  ) {
    super(productRepository, 'product', errorMapper);
    this.manager = DataBase.dataSource.createEntityManager();
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Product>,
    authUser: AuthUser
  ): void {
    throw new Error('Method not implemented.');
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Product>,
    args: {}
  ): void {
    throw new Error('Method not implemented.');
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Product>,
    args?: {} | undefined
  ): void {
    throw new Error('Method not implemented.');
  }

  public async create(
    input: Input<Product>,
    _authUser?: AuthUser
  ): Promise<DataResponse<Product>> {
    try {
      const productName = await this.manager
        .findOneOrFail(Course, {
          where: { id: input.course?.id },
        })
        .then((course) => course.title);

      const product = await this.productRepository.save({
        ...input,
        productName,
        course: { id: input.course?.id },
      });

      return { status: 201, data: { product } };
    } catch ({ message }) {
      Logger.error(message);
      throw this.errorMapper.throw(message);
    }
  }

  public update(
    id: string,
    input: Input<Product>,
    authUser?: AuthUser
  ): Promise<DataResponse<Product>> {
    throw new Error('Method not implemented.');
  }

  public async findOne(input: any, isCourse: boolean): Promise<Product> {
    return await this.productRepository.findOneOrFail({
      where: {
        [`${isCourse ? 'course' : 'lesson'}`]: {
          id: isCourse
            ? input?.product?.course?.id
            : input?.product?.lesson?.id,
        },
      },
      relations: [isCourse ? 'course' : 'lesson'],
    });
  }
}
