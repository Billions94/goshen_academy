export interface Paging {
  page: number;
  limit: number;
}

export interface Pagination<T> {
  page: number;
  limit: number;
  results: T;
  pageCount: number;
}

export interface Order {
  key: string;
  value: 'ASC' | 'DESC';
}

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

export interface ResultAndCount<T> {
  results: T[];
  count: number;
}

export type Input<Entity> = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
