import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../../../auth/interface';
import { AbstractEntityCrudService } from '../../../core/abstract-entity-crud.service';
import { Input } from '../../../e-learning/interfaces';
import { DataResponse } from '../../../e-learning/interfaces/response';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Product } from '../entity/product.entity';
import { ProductRepository } from '../repository/product.repository';

@Service()
export class ProductService extends AbstractEntityCrudService<Product, {}> {
  constructor(
    @Inject()
    private readonly productRepository: ProductRepository,
    @Inject()
    private readonly errorMapper: ErrorMapper
  ) {
    super(productRepository, 'product', errorMapper);
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
      const product = await this.productRepository.save(input);
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
