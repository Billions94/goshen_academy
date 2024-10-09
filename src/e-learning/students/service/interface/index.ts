import { TokenResponse } from '../../../../auth/interface';
import { LoginInput, Pagination } from '../../../interfaces';
import { DataResponse } from '../../../interfaces/response';
import { Student } from '../../entity/student.entity';

export interface StudentServiceInterface<Entity> {
  login(loginInput: LoginInput): Promise<Partial<TokenResponse>>;

  getStudents(): Promise<Partial<Pagination<Partial<Student[]>>>>;

  getCurrentStudent(student: Student): Promise<DataResponse<Entity>>;
}
