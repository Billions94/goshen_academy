import { DataResponse } from '../../../interfaces/response';
import { Student } from '../../entity/student.entity';

export interface StudentServiceInterface<Entity> {
  getCurrentStudent(student: Student): Promise<DataResponse<Entity>>;

  getEnrolledStudents(authUser?: Entity): Promise<DataResponse<Entity[]>>;
}
