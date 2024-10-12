import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Student } from '../../entity/student.entity';

export interface StudentServiceInterface<Entity> {
  getCurrentStudent(student: Student): Promise<DataResponse<Entity>>;

  getEnrolledStudents(authUser?: Entity): Promise<DataResponse<Entity[]>>;

  resetPassword(
    student: Student,
    oldPassword: string,
    newPassword: string
  ): Promise<DeleteResponse>;
}
