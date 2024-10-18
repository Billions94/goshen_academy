import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthUser } from '../../../auth/interface';
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
    @CurrentUser() authUser: AuthUser,
    @Body() input: ResultInput
  ): Promise<DataResponse<Result>> {
    return this.resultService.create(input, authUser);
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

  @Get('/:resultId')
  async getResult(
    @Param('resultId') resultId: string
  ): Promise<DataResponse<Result>> {
    return this.resultService.findById(resultId);
  }

  @Authorized()
  @Patch('/:resultId')
  async updateResult(
    @CurrentUser() authUser: AuthUser,
    @Param('resultId') resultId: string,
    @Body() input: ResultInput
  ): Promise<DataResponse<Result>> {
    return this.resultService.update(resultId, input, authUser);
  }

  @Authorized()
  @Delete('/:resultId')
  async deleteResult(
    @CurrentUser() authUser: AuthUser,
    @Param('resultId') resultId: string
  ): Promise<DeleteResponse> {
    return this.resultService.deleteById(resultId, authUser);
  }
}
