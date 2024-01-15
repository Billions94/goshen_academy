import { Service } from 'typedi';
import { StudentServiceInterface } from './interface';
import { Student } from '../entity/student';
import { Inject } from 'typescript-ioc';
import { StudentRepository } from '../repository/studentRepository';
import { StudentInput } from '../interface';
import { DeleteResponse, DataResponse } from '../../../interfaces/response';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { TokenResponse } from '../../../auth/interface';
import { LoginInput } from '../../../interfaces';
import { JwtAuthService } from '../../../auth/jwtService';
import { CredentialManager } from '../../../auth/credential/credentialsManager';
import { studentResponseMapper } from '../mapper/studentResponseMapper';
import { Validator } from '../../../utils/validator/validator';

@Service()
export class StudentService implements StudentServiceInterface {
  @Inject
  private readonly jwtAuthService: JwtAuthService;
  @Inject
  private readonly studentRepository: StudentRepository;
  @Inject
  private readonly customErrorResponse: ErrorMapper;

  async createStudent(input: StudentInput): Promise<DataResponse> {
    try {
      Validator.validateRegisterInput(input);

      const student = this.studentRepository.create(input);
      const hashPassword = await CredentialManager.hashPassword(input.password);
      student.setPassword(hashPassword);

      await this.studentRepository.save(student);
      const studentId = student.id;

      const { accessToken, refreshToken } =
        await this.jwtAuthService.tokenGenerator(student);

      return {
        status: 201,
        data: { studentId },
        tokens: { accessToken, refreshToken },
      };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async login(loginInput: LoginInput): Promise<Partial<TokenResponse>> {
    try {
      const student = await CredentialManager.verifyCredentials(
        loginInput.email,
        loginInput.password
      );

      if (student) {
        const { accessToken, refreshToken } =
          await this.jwtAuthService.tokenGenerator(student);

        return { accessToken, refreshToken };
      } else {
        return {
          error: { message: 'Invalid email or password' },
        };
      }
    } catch ({ message }) {
      Logger.error(message);
      return { error: { message } };
    }
  }

  async getStudents(): Promise<Partial<Student[]>> {
    const students = this.studentRepository
      .getStudents()
      .then((students) => students.map(studentResponseMapper));

    if (students) return students as any;

    return [];
  }

  async getStudent(id: number): Promise<DataResponse> {
    try {
      const student = (await this.studentRepository.getStudent(id)) as Student;
      return { status: 200, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async updateStudent(
    id: number,
    studentInput: StudentInput
  ): Promise<Partial<DataResponse>> {
    try {
      const student = await this.studentRepository.updateStudent(
        id,
        studentInput
      );

      return { status: 203, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.customErrorResponse.throw(message);
    }
  }

  async deleteStudent(id: number): Promise<DeleteResponse> {
    try {
      await this.studentRepository.deleteStudent(id);
      return { status: 'success' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }
}
