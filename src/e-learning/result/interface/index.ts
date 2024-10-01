import { Result } from '../entity/result.entity';

export interface ResultInput extends Omit<Result, 'id'> {}
