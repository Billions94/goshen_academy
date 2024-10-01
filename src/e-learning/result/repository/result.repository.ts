import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../db/init';
import { Result } from '../entity/result.entity';

@Service()
export class ResultRepository extends Repository<Result> {
  constructor() {
    super(Result, DataBase.dataSource.createEntityManager());
  }

  async getById(id: string): Promise<Result> {
    return (await this.findOne({ where: { id } })) as Result;
  }
}
