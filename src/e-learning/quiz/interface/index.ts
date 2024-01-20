import { Quiz } from '../entity/quiz';

export interface QuizInput extends Omit<Quiz, 'id' | ''> {}
