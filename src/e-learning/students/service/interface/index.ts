import { Student } from '../../entity/student';
import { StudentInput } from '../../interface';
import { DeleteResponse, DataResponse } from '../../../../interfaces/response';
import { TokenResponse } from '../../../../auth/interface';
import { LoginInput } from '../../../../interfaces';
export interface StudentServiceInterface {
  createStudent(studentInput: StudentInput): Promise<DataResponse>;
  login(loginInput: LoginInput): Promise<Partial<TokenResponse>>;
  getStudents(): Promise<Partial<Student[]>>;
  getStudent(id: number): Promise<DataResponse>;
  updateStudent(
    id: number,
    studentInput: StudentInput
  ): Promise<Partial<DataResponse>>;
  deleteStudent(id: number): Promise<DeleteResponse>;
}
