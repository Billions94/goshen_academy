import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../../db/init';
import { Order } from '../../../../e-learning/students/interface';
import { addPagination } from '../../../../utils/helper/add-pagination';
import { Lesson } from '../entity/lesson';

@Service()
export class LessonRepository extends Repository<Lesson> {
  constructor() {
    super(Lesson, DataBase.dataSource.createEntityManager());
  }

  /**
   * Retrieves a Lesson object by its unique identifier.
   *
   * @param id - The unique identifier of the Lesson to retrieve.
   *
   * @returns A Promise that resolves to a Lesson object if found, or `undefined` if not found.
   *
   * @throws Will throw an error if the database operation fails.
   */
  async findById(id: number): Promise<Lesson> {
    return (await this.findOne({ where: { id } })) as Lesson;
  }

  /**
   * Retrieves a paginated list of Lesson objects, along with their associated Students,
   * sorted by the provided order.
   *
   * @param order - The order in which to sort the Lessons.
   * @param limit - The maximum number of Lessons to return per page.
   * @param skip - The number of Lessons to skip before returning results.
   *
   * @returns A Promise that resolves to an array of Lesson objects.
   *
   * @throws Will throw an error if the database operation fails.
   */
  async getLessonsAndPaginate(
    order: Order,
    limit: number,
    skip: number
  ): Promise<Lesson[]> {
    const queryBuilder = this.createQueryBuilder('lesson');
    return await addPagination(queryBuilder, { limit, page: skip })
      .leftJoinAndSelect('lesson.students', 'students')
      .orderBy(`${order.key}`, `${order.value}`)
      .cache(25000)
      .getMany();
  }

  /**
   * Deletes a Lesson object from the database by its unique identifier.
   *
   * @param id - The unique identifier of the Lesson to delete.
   *
   * @returns A Promise that resolves to `void` once the deletion is complete.
   *
   * @throws Will throw an error if the database operation fails.
   */
  async deleteById(id: number): Promise<void> {
    await this.delete({ id });
  }
}
