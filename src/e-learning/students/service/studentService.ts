import { Inject, Service } from 'typedi';
import { CredentialManager } from '../../../auth/credential/credentialsManager';
import { TokenResponse } from '../../../auth/interface';
import { JwtAuthService } from '../../../auth/jwtService';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Validator } from '../../../utils/validator/validator';
import { LoginInput, Order, Pagination, Paging } from '../../interfaces';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
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
  @Inject()
  private readonly jwtAuthService: JwtAuthService;
  @Inject()
  private readonly credentialManager: CredentialManager;
  @Inject()
  private readonly studentRepository: StudentRepository;
  @Inject()
  private readonly errorResponseMapper: ErrorMapper;

  async createStudent(input: StudentInput): Promise<DataResponse> {
    try {
      Validator.validateRegisterInput(input);

      const student = this.studentRepository.create(input);
      const hashPassword = await this.credentialManager.hashPassword(
        input.password
      );
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
      return this.errorResponseMapper.throw(message);
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<Partial<TokenResponse>> {
    try {
      const student = await this.credentialManager.verifyCredentials(
        email,
        password
      );

      if (student) {
        const { accessToken, refreshToken } =
          await this.jwtAuthService.tokenGenerator(student);
        await this.credentialManager.hashRefreshToken(refreshToken, student);

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

  async getStudents(
    query?: Paging,
    order?: Order
  ): Promise<Partial<Pagination>> {
    try {
      if (query?.limit && query.page && order?.key && order?.value) {
        const { limit, page } = query;

        return {
          limit: limit,
          page: page,
          results: await this.mapStudents({ query, order }),
        };
      } else {
        return {
          limit: 0,
          page: 0,
          results: await this.mapStudents(),
        };
      }
    } catch ({ message }) {
      Logger.error(message);
      return {
        limit: 0,
        page: 0,
        results: [],
      };
    }
  }

  async mapStudents(options?: { query: Paging; order: Order }) {
    return options
      ? ((await this.studentRepository
          .getStudentsAndPaginate(
            {
              key: options.order.key,
              value: options.order.value,
            },
            options.query.limit,
            options.query.page
          )
          .then((students) => students.map(studentResponseMapper))) as Partial<
          Student[]
        >)
      : ((await this.studentRepository
          .find()
          .then((students) => students.map(studentResponseMapper))) as Partial<
          Student[]
        >);
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
    studentInput: Partial<StudentInput>,
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
