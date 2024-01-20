import { DELETE, GET, PATCH, Path, PathParam, POST } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { ResultService } from '../service/resultService';
import { ResultInput } from '../interface';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';

@Path('/api/results')
export class ResultController {
  @Inject
  private readonly resultService: ResultService;

  @POST
  async createResult(input: ResultInput): Promise<DataResponse> {
    return this.resultService.createResult(input);
  }

  @GET
  @Path(':id')
  async getResult(@PathParam('id') id: number): Promise<DataResponse> {
    return this.resultService.getResult(id);
  }

  @PATCH
  @Path(':id')
  async updateResult(
    @PathParam('id') id: number,
    input: ResultInput
  ): Promise<DataResponse> {
    return this.resultService.updateResult(id, input);
  }

  @DELETE
  @Path(':id')
  async deleteResult(id: number): Promise<DeleteResponse> {
    return this.resultService.deleteResult(id);
  }
}
