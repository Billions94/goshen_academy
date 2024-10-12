import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../db/init';
import { Course } from '../entity/course.entity';

@Service()
export class CourseRepository extends Repository<Course> {
  constructor() {
    super(Course, DataBase.dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Course> {
    return (await this.findOne({ where: { id } })) as Course;
  }
}
