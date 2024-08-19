import { Lesson } from '../../../e-learning/lessons/lesson/entity/lesson';
import { Student } from '../entity/student';

export interface StudentInput
  extends Omit<Student, 'createdAt' | 'updatedAt' | 'id'> {
  password: string;
  confirmPassword: string;
}

export interface SqlRawQueryMapperStudent {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  address: string | null;
  lessonList: Lesson[];
  date_of_birth: Date;
  email: string;
  password: string | null;
  refresh_token: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}
