import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../../db/init';
import { Lesson } from '../entity/lesson.entity';

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
  async findById(id: string): Promise<Lesson> {
    return (await this.findOne({ where: { id } })) as Lesson;
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
  async deleteById(id: string): Promise<void> {
    await this.delete({ id });
  }
}
