import { Student } from '../entity/student';

export interface StudentInput
  extends Omit<Student, 'createdAt' | 'updatedAt' | 'id'> {
  password: string;
  confirmPassword: string;
}
