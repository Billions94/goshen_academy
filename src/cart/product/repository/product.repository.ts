import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { ProductType } from '../../../cart/service/interface';
import { FindArgs } from '../../../core/abstract-entity-crud.service';
import { DataBase } from '../../../db/init';
import { Product } from '../entity/product.entity';

@Service()
export class ProductRepository extends Repository<Product> {
  constructor() {
    super(Product, DataBase.dataSource.createEntityManager());
  }

  /**
   * Find a product based on various conditions including where clauses, relations, ordering, and product type.
   * @param options Find options containing where conditions, relations, and ordering
   * @param productType The type of the product (e.g., COURSE, LESSON)
   */
  public async findByProductType(
    options: FindArgs<Product>,
    productType: ProductType
  ): Promise<Product | null> {
    const query = this.createQueryBuilder('product');

    if (productType === ProductType.COURSE) {
      query.leftJoinAndSelect('product.course', 'course');
    } else if (productType === ProductType.LESSON) {
      query.leftJoinAndSelect('product.lesson', 'lesson');
    }

    if (options.where?.relations && options.where.relations.length > 0) {
      options.where.relations.forEach((relation) => {
        query.leftJoinAndSelect(`product.${relation}`, relation);
      });
    }

    if (options.order) {
      Object.keys(options.order).forEach((key) => {
        const orderDirection = options.order;

        if (orderDirection) {
          if (
            orderDirection.value === 'ASC' ||
            orderDirection.value === 'DESC'
          ) {
            query.addOrderBy(`product.${key}`, orderDirection.value);
          } else {
            console.warn(
              `Invalid order direction: ${orderDirection} for field: ${key}`
            );
          }
        }
      });
    }

    return query.getOne();
  }
}
