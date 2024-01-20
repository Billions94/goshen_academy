import { Service } from 'typedi';
import { ResultServiceInterface } from './interface';
import { ResultInput } from '../interface';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import Logger from '../../../utils/logger/logger';
import { Inject } from 'typescript-ioc';
import { ResultRepository } from '../repository/resultRepository';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';

@Service()
export class ResultService implements ResultServiceInterface {
  @Inject
  private readonly resultRepository: ResultRepository;
  @Inject
  private readonly errorResponseMapper: ErrorMapper;

  async createResult(input: ResultInput): Promise<DataResponse> {
    try {
      const newResult = this.resultRepository.create(input);
      await this.resultRepository.save(newResult);
      const resultId = newResult.id;

      return { status: 201, data: { resultId } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async getResult(id: number): Promise<DataResponse> {
    try {
      const result = await this.resultRepository.getById(id);
      return { status: 200, data: { result } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async updateResult(id: number, update: ResultInput): Promise<DataResponse> {
    try {
      await this.resultRepository.update(id, update);
      const updateResult = await this.resultRepository.getById(id);

      return { status: 203, data: { updateResult } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async deleteResult(id: number): Promise<DeleteResponse> {
    try {
      await this.resultRepository.delete(id);
      return { status: 'success' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }
}
