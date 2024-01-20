import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { LessonVideo } from '../entity/lessonVideo';
import { DataBase } from '../../../../db/init';

@Service()
export class LessonVideoRepository extends Repository<LessonVideo> {
  constructor() {
    super(LessonVideo, DataBase.dataSource.createEntityManager());
  }

  async getById(id: number): Promise<LessonVideo> {
    return (await this.findOne({ where: { id } })) as LessonVideo;
  }
}
