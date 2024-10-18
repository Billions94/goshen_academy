import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../../db/init';
import { LessonCategory } from '../entity/lesson-category.entity';

@Service()
export class LessonCategoryRepository extends Repository<LessonCategory> {
  constructor() {
    super(LessonCategory, DataBase.dataSource.createEntityManager());
  }

  async findById(id: string): Promise<LessonCategory> {
    return (await this.findOne({ where: { id } })) as LessonCategory;
  }
}
