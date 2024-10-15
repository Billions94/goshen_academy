import { Student } from '../../e-learning/students/entity/student.entity';

export interface AuthUser
  extends Pick<Student, 'id' | 'isAdmin' | 'courses' | 'privileges'> {}
