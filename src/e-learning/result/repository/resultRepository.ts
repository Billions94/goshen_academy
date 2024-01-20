import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Result } from '../entity/result';
import { DataBase } from '../../../db/init';

@Service()
export class ResultRepository extends Repository<Result> {
  constructor() {
    super(Result, DataBase.dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Result> {
    return (await this.findOne({ where: { id } })) as Result;
  }
}
