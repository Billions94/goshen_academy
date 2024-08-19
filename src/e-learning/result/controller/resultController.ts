import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { ResultInput } from '../interface';
import { ResultService } from '../service/resultService';

@Service()
@JsonController('/results')
export class ResultController {
  @Inject()
  private readonly resultService: ResultService;

  @Authorized()
  @Post()
  async createResult(@Body() input: ResultInput): Promise<DataResponse> {
    return this.resultService.createResult(input);
  }

  @Get('/:id')
  async getResult(@Param('id') id: number): Promise<DataResponse> {
    return this.resultService.getResult(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateResult(
    @Param('id') id: number,
    @Body() input: ResultInput
  ): Promise<DataResponse> {
    return this.resultService.updateResult(id, input);
  }

  @Authorized()
  @Delete('/:id')
  async deleteResult(@Param('id') id: number): Promise<DeleteResponse> {
    return this.resultService.deleteResult(id);
  }
}
