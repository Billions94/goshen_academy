import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { ProductType } from '../../cart/service/interface';
import { FindArgs } from '../../core/abstract-entity-crud.service';
import { DataBase } from '../../db/init';
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
      query.andWhere('product."courseId" = :courseId', {
        courseId: options?.where?.course?.id,
      });
    } else if (productType === ProductType.LESSON) {
      query.andWhere('product."lessonId" = :lessonId', {
        lessonId: options?.where?.lesson?.id,
      });
    }

    return query.getOne();
  }
}
