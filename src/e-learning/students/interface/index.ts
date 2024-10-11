import { Lesson } from '../../../e-learning/lessons/lesson/entity/lesson.entity';
import { Student } from '../entity/student.entity';

export interface StudentInput extends Omit<Student, 'password'> {
  password: string;
  readonly confirmPassword: string;
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

export interface Auth {
  setRefreshToken(refreshToken: string): void;
  getRefreshToken(): string | null;
  setPassword(password: string): void;
  getPassword(): string;
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
