import { Result } from '../entity/result';

export interface ResultInput extends Omit<Result, 'id'> {}
