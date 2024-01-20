import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { ResultInput } from '../../interface';

export interface ResultServiceInterface {
  createResult(input: ResultInput): Promise<DataResponse>;
  getResult(id: number): Promise<DataResponse>;
  updateResult(id: number, update: ResultInput): Promise<DataResponse>;
  deleteResult(id: number): Promise<DeleteResponse>;
}
