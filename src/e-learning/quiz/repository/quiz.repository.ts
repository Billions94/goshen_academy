import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../db/init';
import { Quiz } from '../entity/quiz.entity';
import { QuizInput } from '../interface';

@Service()
export class QuizRepository extends Repository<Quiz> {
  constructor() {
    super(Quiz, DataBase.dataSource.createEntityManager());
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
