import { Order, Pagination, Paging } from '../../../interfaces';
import { Quiz } from '../../entity/quiz.entity';

export interface QuizServiceInterface {
  getQuizzesAndCount(
    { limit, page }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Quiz[]>>;
}
