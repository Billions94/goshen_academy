import { TokenResponse } from '../../auth/interface';

export interface DataResponse {
  status: number;
  data: Data | null;
  tokens?: TokenResponse;
  error?: { message: string };
}

export interface Data {
  [key: string]: any;
}

export interface DeleteResponse {
  status: 'success' | 'failed';
}
