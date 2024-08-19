import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Pagination } from '../../e-learning/students/interface';

export function addPagination<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  pagination: Omit<Pagination, 'results'>
): SelectQueryBuilder<T> {
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 10;

  queryBuilder.take(limit);
  queryBuilder.skip((page - 1) * limit);

  return queryBuilder;
}
