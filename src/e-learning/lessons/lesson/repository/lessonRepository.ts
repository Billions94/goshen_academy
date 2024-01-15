import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Lesson } from '../entity/lesson';
import { DataBase } from '../../../../db/init';

@Service()
export class LessonRepository extends Repository<Lesson> {
  constructor() {
    super(Lesson, DataBase.dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Lesson> {
    return (await this.findOne({ where: { id } })) as Lesson;
  }

  async deleteById(id: number): Promise<void> {
    await this.delete({ id });
  }
}
