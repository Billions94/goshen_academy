import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { LessonCategory } from '../entity/lessonCategory';
import { DataBase } from '../../../../db/init';

@Service()
export class LessonCategoryRepository extends Repository<LessonCategory> {
  constructor() {
    super(LessonCategory, DataBase.dataSource.createEntityManager());
  }

  async findById(id: number): Promise<LessonCategory> {
    return (await this.findOne({ where: { id } })) as LessonCategory;
  }
}
