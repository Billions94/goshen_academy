import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Order, Pagination, Paging } from '../../../e-learning/interfaces';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { Result } from '../entity/result.entity';
import { ResultInput } from '../interface';
import { ResultService } from '../service/result.service';

@Service()
@JsonController('/results')
export class ResultController {
  @Inject()
  private readonly resultService: ResultService;

  @Authorized()
  @Post()
  async createResult(
    @Body() input: ResultInput
  ): Promise<DataResponse<Result>> {
    return this.resultService.create(input);
  }

  @Get()
  async getAllResults(
    @QueryParams() { page, limit, key = 'id', value = 'DESC' }: Order & Paging
  ): Promise<Pagination<Result[]>> {
    return this.resultService.getQuizzesAndCount(
      { page, limit },
      { key, value }
    );
  }

  @Get('/:id')
  async getResult(@Param('id') id: string): Promise<DataResponse<Result>> {
    return this.resultService.findById(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateResult(
    @Param('id') id: string,
    @Body() input: ResultInput
  ): Promise<DataResponse<Result>> {
    return this.resultService.update(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteResult(@Param('id') id: string): Promise<DeleteResponse> {
    return this.resultService.deleteById(id);
  }
}
