import { TokenResponse } from '../../../auth/service/interface';

export interface DataResponse<Entity> {
  status: number;
  data: Data<Entity> | null;
  tokens?: TokenResponse;
  error?: {
    message: string;
    status?: DeleteResponse;
  };
}

export interface Data<Entity> {
  [key: string]: Partial<Entity>;
}

export interface DeleteResponse {
  status: 'success' | 'failed';
  message?: string;
}
