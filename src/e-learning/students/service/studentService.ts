import { Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import { CredentialManager } from '../../../auth/credential/credentialsManager';
import { TokenResponse } from '../../../auth/interface';
import { JwtAuthService } from '../../../auth/jwtService';
import { LoginInput } from '../../../interfaces';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Validator } from '../../../utils/validator/validator';
import { Student } from '../entity/student';
import { SqlRawQueryMapperStudent, StudentInput } from '../interface';
import {
  sqlRawQueryMapper,
  studentResponseMapper,
} from '../mapper/studentResponseMapper';
import { StudentRepository } from '../repository/studentRepository';
import { StudentServiceInterface } from './interface';

@Service()
export class StudentService implements StudentServiceInterface {
  @Inject
  private readonly jwtAuthService: JwtAuthService;
  @Inject
  private readonly studentRepository: StudentRepository;
  @Inject
  private readonly errorResponseMapper: ErrorMapper;

  async createStudent(input: StudentInput): Promise<DataResponse> {
    try {
      Validator.validateRegisterInput(input);

      const student = this.studentRepository.create(input);
      const hashPassword = await CredentialManager.hashPassword(input.password);
      console.log({ hashPassword });
      student.setPassword(hashPassword);

      await this.studentRepository.save(student);
      const studentId = student.studentId;

      console.log('', studentId);

      const { accessToken, refreshToken } =
        await this.jwtAuthService.tokenGenerator(student);

      return {
        status: 201,
        data: { studentId },
        tokens: { accessToken, refreshToken },
      };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<Partial<TokenResponse>> {
    try {
      const student = await CredentialManager.verifyCredentials(
        email,
        password
      );

      if (student) {
        const { accessToken, refreshToken } =
          await this.jwtAuthService.tokenGenerator(student);

        await CredentialManager.hashRefreshToken(refreshToken, student);

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
    const students = (await this.studentRepository
      .getStudents()
      .then((students) => students.map(studentResponseMapper))) as Partial<
      Student[]
    >;

    if (students) return students;

    return [];
  }

  async getStudent(id: number): Promise<DataResponse> {
    try {
      const student = studentResponseMapper(
        await this.studentRepository.findById(id)
      );

      return { status: 200, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async getStudentByStudentId(studentId: string): Promise<DataResponse> {
    try {
      const student = sqlRawQueryMapper(
        <SqlRawQueryMapperStudent>(
          await this.studentRepository.getByStudentId(studentId)
        )
      );

      return { status: 200, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  async updateStudent(
    id: number,
    studentInput: StudentInput,
    studentFromReq: Student
  ): Promise<Partial<DataResponse>> {
    try {
      const student = await this.studentRepository.updateStudent(
        id,
        studentInput,
        studentFromReq
      );

      return { status: 203, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
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
