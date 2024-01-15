import { Student } from '../entity/student';

export const studentResponseMapper = (student: Student): Partial<Student> => ({
  id: student.id,
  studentId: student.studentId,
  firstName: student.firstName,
  lastName: student.lastName,
  age: student.age,
  nationality: student.nationality,
  address: student.address,
  email: student.email,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
});
