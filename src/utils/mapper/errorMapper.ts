import { Service } from 'typedi';
import { ErrorResponse } from '../../interfaces';

@Service()
export class ErrorMapper {
  private static readonly POSTGRES_UNIQUE_KEY_ERROR =
    'duplicate key value violates unique constraint';

  throw = (message: string, status?: number): ErrorResponse => {
    if (message.includes(ErrorMapper.POSTGRES_UNIQUE_KEY_ERROR)) {
      message = 'Email address already exists!';
    }

    return {
      status: status || 400,
      data: null,
      error: { message },
    };
  };
}
