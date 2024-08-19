import { TokenResponse } from '../../../../auth/interface';
import { LoginInput } from '../../../interfaces';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Student } from '../../entity/student';
import { Pagination, StudentInput } from '../../interface';

export interface StudentServiceInterface {
  createStudent(studentInput: StudentInput): Promise<DataResponse>;
  login(loginInput: LoginInput): Promise<Partial<TokenResponse>>;
  getStudents(): Promise<Partial<Pagination>>;
  getStudent(id: number): Promise<DataResponse>;
  updateStudent(
    id: number,
    studentInput: StudentInput,
    student?: Student
  ): Promise<Partial<DataResponse>>;
  deleteStudent(id: number): Promise<DeleteResponse>;
}
