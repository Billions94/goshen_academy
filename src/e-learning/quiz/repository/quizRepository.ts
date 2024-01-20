import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Quiz } from '../entity/quiz';
import { DataBase } from '../../../db/init';

@Service()
export class QuizRepository extends Repository<Quiz> {
  constructor() {
    super(Quiz, DataBase.dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Quiz> {
    return (await this.findOne({ where: { id } })) as Quiz;
  }
}
