import { Student } from '../entity/student.entity';
import { SqlRawQueryMapperStudent } from '../interface';

export const studentResponseMapper = (student: Student): Partial<Student> => ({
  id: student.id,
  studentId: student.studentId,
  firstName: student.firstName,
  lastName: student.lastName,
  dateOfBirth: student.dateOfBirth,
  nationality: student.nationality,
  courses: student.courses,
  address: student.address,
  email: student.email,
  phone: student.phone,
  image: student.image,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
  enrollmentDate: student.enrollmentDate,
});

export const sqlRawQueryMapper = (student: SqlRawQueryMapperStudent) => ({
  id: student.id,
  studentId: student.student_id,
  firstName: student.first_name,
  lastName: student.last_name,
  nationality: student.nationality,
  lessonList: student.lessonList,
  address: student.address,
  email: student.email,
  createdAt: student.created_at,
  updatedAt: student.updated_at,
});
