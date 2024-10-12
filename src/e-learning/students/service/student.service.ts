import * as bcryptService from 'bcrypt';
import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { AuthService } from '../../../auth/auth.service';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../core/abstract-entity-crud.service';
import Logger from '../../../utils/logger/logger';
import { ErrorMapper } from '../../../utils/mapper/errorMapper';
import { Validator } from '../../../utils/validator/validator';
import { Input, Order, Pagination, Paging } from '../../interfaces';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { Student } from '../entity/student.entity';
import { StudentInput } from '../interface';
import { studentResponseMapper } from '../mapper/studentResponseMapper';
import { StudentRepository } from '../repository/student.repository';
import { StudentServiceInterface } from './interface';

interface StudentServiceWhereArgs extends FindArgs<Student> {}

@Service()
export class StudentService
  extends AbstractEntityCrudService<Student, StudentServiceWhereArgs>
  implements StudentServiceInterface<Student>
{
  constructor(
    @Inject()
    private readonly authService: AuthService,
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
      queryBuilder.orderBy(`student."${key}"`, value);
    }
  }
  public async create(
    input: Input<StudentInput>,
    _authUser?: Student
  ): Promise<DataResponse<Student>> {
    try {
      Validator.validateRegisterInput(input);
      const newStudent = this.studentRepository.create(input);
      const { accessToken, refreshToken } = await this.authService.register(
        newStudent
      );

      return {
        status: 201,
        data: { student: { id: newStudent.id } },
        tokens: { accessToken, refreshToken },
      };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
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
        results: results.map(studentResponseMapper) as Student[],
        pageCount: Math.ceil(count / pagination.limit),
        total: count,
      };
    } catch ({ message }) {
      Logger.error(message);
      return {
        page: 0,
        limit: 0,
        results: [],
        pageCount: 0,
        total: 0,
      };
    }
  }

  async getEnrolledStudents(
    authUser?: Student
  ): Promise<DataResponse<Student[]>> {
    try {
      if (!authUser?.isAdmin) {
        throw new Error('Unauthorized access');
      }

      const enrollendStudents = await this.studentRepository
        .createQueryBuilder('student')
        .where('student."enrollmentDate" IS NOT NULL')
        .getMany();

      return {
        status: 200,
        data: {
          results: enrollendStudents.map(studentResponseMapper) as Student[],
        },
      };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
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
        authUser ? authUser.id : id,
        input,
        authUser ? authUser : <Student>{}
      );

      return { status: 203, data: { student } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorResponseMapper.throw(message);
    }
  }

  public async resetPassword(
    student: Student,
    oldPassword: string,
    newPassword: string
  ): Promise<DeleteResponse> {
    try {
      if (await bcryptService.compare(oldPassword, student.getPassword())) {
        student.setPassword('');
        const hashedPassword = await bcryptService.hash(
          newPassword,
          parseInt(`${process.env.SALT_FACTOR}`)
        );

        student.setPassword(hashedPassword);
        await this.studentRepository.save(student);
        return { status: 'success' };
      }

      return { status: 'failed' };
    } catch ({ message }) {
      Logger.error(message);
      return { status: 'failed' };
    }
  }
}
