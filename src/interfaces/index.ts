export interface LoginInput {
  email: string;
  password: string;
}

export interface ErrorResponse {
  status: number;
  data: any;
  error: {
    message: string;
  };
}
