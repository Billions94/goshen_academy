import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { CredentialManager } from '../../../auth/credential/credential.manager';
import { TokenResponse } from '../../../auth/interface';
import { JwtAuthService } from '../../../auth/jwt-auth.service';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../core/abstract-entity-crud.service';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Validator } from '../../../utils/validator/validator';
import {
  Input,
  LoginInput,
  Order,
  Pagination,
  Paging,
  ResultAndCount,
} from '../../interfaces';
import { DataResponse } from '../../interfaces/response';
import { Student } from '../entity/student.entity';
import { StudentInput } from '../interface';
import { studentResponseMapper } from '../mapper/studentResponseMapper';
import { StudentRepository } from '../repository/student.repository';
import { StudentServiceInterface } from './interface';

interface StudentServiceWhereArgs extends FindArgs<Student> {
  where?: Omit<Student, 'lessons'>;
}

@Service()
export class StudentService
  extends AbstractEntityCrudService<Student, StudentServiceWhereArgs>
  implements StudentServiceInterface<Student>
{
  constructor(
    @Inject()
    private readonly jwtAuthService: JwtAuthService,
    @Inject()
    private readonly credentialManager: CredentialManager,
    @Inject()
    private readonly studentRepository: StudentRepository,
    @Inject()
    private readonly errorResponseMapper: ErrorMapper
  ) {
    super(studentRepository, 'student', errorResponseMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Student>,
    authUser: Student
  ): void {
    if (authUser) {
      queryBuilder
        .andWhere('student.id = :id', { id: authUser.id })
        .andWhere('student.isAdmin = :isAdmin', { isAdmin: authUser.isAdmin });
    }
  }
  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Student>,
    args: StudentServiceWhereArgs
  ): void {
    if (args?.where?.id) {
      queryBuilder.where('student.id = :id', { id: args.where.id });
    }

    if (args?.where?.firstName) {
      queryBuilder.andWhere('student.firstName = :firstName', {
        firstName: args.where.firstName,
      });
    }

    if (args?.where?.lastName) {
      queryBuilder.andWhere('student.lastName = :lastName', {
        lastName: args.where.lastName,
      });
    }

    if (args?.where?.email) {
      queryBuilder.andWhere('student.email = :email', {
        email: args.where.email,
      });
    }

    if (args?.where?.nationality) {
      queryBuilder.andWhere('student.nationality = :nationality', {
        nationality: args.where.nationality,
      });
    }

    if (args?.where?.address) {
      queryBuilder.andWhere('student.address = :address', {
        address: args.where.address,
      });
    }
  }
  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Student>,
    args?: StudentServiceWhereArgs | undefined
  ): void {
    if (args && args.order) {
      const { key, value } = args.order;
      queryBuilder.orderBy(`student.${key}`, value);
    }
  }
  public async create(
    input: Input<StudentInput>,
    _authUser?: Student
  ): Promise<DataResponse<Student>> {
    try {
      Validator.validateRegisterInput(input);

      const newStudent = this.studentRepository.create(input);
      const hashPassword = await this.credentialManager.hashPassword(
        input.password
      );
      newStudent.setPassword(hashPassword);

      await this.studentRepository.save(newStudent);
      const { accessToken, refreshToken } =
        await this.jwtAuthService.tokenGenerator(newStudent);

      const student = { id: newStudent.id };

      return {
        status: 201,
        data: { student },
        tokens: { accessToken, refreshToken },
      };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }
  public async update(
    id: string,
    input: Input<Student>,
    authUser?: Student
  ): Promise<DataResponse<Student>> {
    try {
      if (!authUser || !authUser.isAdmin) {
        return this.errorResponseMapper.throw(
          'Unauthorized access to update student',
          401
        );
      }

      const existingStudent = await this.studentRepository.findOne({
        where: { id },
      });

      if (!existingStudent) {
        return this.errorResponseMapper.throw('Student not found', 404);
      }

      const student = await this.studentRepository.updateStudent(
        id,
        input,
        authUser ? authUser : <Student>{}
      );

      return { status: 203, data: { student } };
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

  async getCurrentStudent(student: Student): Promise<DataResponse<Student>> {
    try {
      return { status: 200, data: { student: studentResponseMapper(student) } };
    } catch ({ message }) {
      Logger.error({ message });
      return this.errorResponseMapper.throw(message);
    }
  }

  async getStudentsAndCount(
    { page, limit }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Student[]>> {
    try {
      if (!order?.key && !order?.value) {
        order = { key: 'id', value: 'DESC' };
      }

      const pagination = { page: Number(page), limit: Number(limit) };
      const [results, count] = await this.findManyAndCount({
        pagination,
        order,
        where,
      });

      return {
        ...pagination,
        results,
        pageCount: Math.ceil(count / pagination.limit),
      };
    } catch ({ message }) {
      Logger.error(message);
      return {
        page: 0,
        limit: 0,
        results: [],
        pageCount: 0,
      };
    }
  }

  async getStudents(
    query?: Paging,
    order?: Order
  ): Promise<Partial<Pagination<Partial<Student[]>>>> {
    try {
      if (query?.limit && query.page && order?.key && order?.value) {
        const { limit, page } = query;
        const { count, results } = await this.mapStudents({ query, order });

        return {
          limit: Number(limit),
          page: Number(page),
          pageCount: Math.ceil(count / Number(limit)),
          results: results as Student[],
        };
      } else {
        return {
          limit: 0,
          page: 0,
          pageCount: 0,
          results: (await this.mapStudents()).results as Student[],
        };
      }
    } catch ({ message }) {
      Logger.error(message);
      return {
        limit: 0,
        page: 0,
        pageCount: 0,
        results: [],
      };
    }
  }

  async mapStudents(options?: {
    query: Paging;
    order: Order;
  }): Promise<ResultAndCount<Partial<Student>>> {
    if (!options) {
      const results = await this.studentRepository
        .find()
        .then((students) => students.map(studentResponseMapper));

      return {
        results,
        count: results.length,
      };
    }

    const [students, count] =
      await this.studentRepository.getStudentsAndPaginate(
        {
          key: options.order.key,
          value: options.order.value,
        },
        options.query.limit,
        options.query.page
      );

    return {
      count,
      results: students.map(studentResponseMapper),
    };
  }

  async getStudentByStudentId(
    studentId: string
  ): Promise<DataResponse<Student>> {
    try {
      const student = (await this.studentRepository.getByStudentId(
        studentId
      )) as any;

      return { status: 200, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }
}
