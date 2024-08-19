import { Lesson } from '../lessons/lesson/entity/lesson';
import { LessonCategory } from '../lessons/lessonCategory/entity/lessonCategory';
import { LessonVideo } from '../lessons/lessonVideo/entity/lessonVideo';
import { Quiz } from '../quiz/entity/quiz';
import { Result } from '../result/entity/result';
import { Student } from '../students/entity/student';

export interface Paging {
  page: number;
  limit: number;
}

export interface Pagination {
  page: number;
  limit: number;
  results:
    | Partial<Student[]>
    | Partial<Lesson[]>
    | Partial<LessonCategory[]>
    | Partial<LessonVideo[]>
    | Partial<Quiz[]>
    | Partial<Result[]>;
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
