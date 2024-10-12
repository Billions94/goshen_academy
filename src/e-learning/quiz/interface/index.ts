import { Quiz } from '../entity/quiz.entity';

export interface QuizInput extends Omit<Quiz, 'id' | ''> {}
