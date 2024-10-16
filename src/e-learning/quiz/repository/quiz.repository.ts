import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../db/init';
import { addPagination } from '../../../utils/helper/add-pagination';
import { Order } from '../../interfaces';
import { Quiz } from '../entity/quiz.entity';
import { QuizInput } from '../interface';

@Service()
export class QuizRepository extends Repository<Quiz> {
  constructor() {
    super(Quiz, DataBase.dataSource.createEntityManager());
  }

  /**
   * Retrieves a paginated list of quizzes based on the provided order, limit, and skip parameters.
   *
   * @param order - The order in which to sort the quizzes.
   * @param limit - The maximum number of quizzes to return per page.
   * @param skip - The number of quizzes to skip before returning the results.
   *
   * @returns A Promise that resolves to an array of Quiz objects.
   *
   * @remarks
   * This function uses TypeORM's QueryBuilder to construct a query that retrieves quizzes based on the provided order,
   * limit, and skip parameters.
   * The results are then cached for 25 seconds to improve performance.
   */
  async getQuizzesAndPaginate(
    order: Order,
    limit: number,
    skip: number
  ): Promise<[Quiz[], number]> {
    const queryBuilder = this.createQueryBuilder('quiz');
    return await addPagination(queryBuilder, { limit, page: skip })
      .orderBy(`${order.key}`, `${order.value}`)
      .cache(25000)
      .getManyAndCount();
  }

  async getById(id: string): Promise<Quiz> {
    return (await this.findOne({ where: { id } })) as Quiz;
  }

  async updateQuiz(
    quizId: string,
    updateInput: Partial<QuizInput>
  ): Promise<Quiz> {
    await this.createQueryBuilder('quiz')
      .select(`quiz`)
      .from(Quiz, 'quiz')
      .update('quiz')
      .set({ ...updateInput })
      .where({ id: quizId })
      .execute();

    return this.getById(quizId);
  }
}
