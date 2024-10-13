import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
} from 'routing-controllers';
import { AuthUser } from 'src/auth/interface';
import { Inject, Service } from 'typedi';
import {
  Input,
  Order,
  Pagination,
  Paging,
  ResetPasswordInput,
} from '../../interfaces';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { Student } from '../entity/student.entity';
import { StudentInput } from '../interface';
import { studentColumnMapper } from '../mapper/studentColumnKeyMapper';
import { StudentService } from '../service/student.service';

@Service()
@JsonController('/students')
export class StudentController {
  @Inject()
  private readonly studentService: StudentService;

  @Get()
  async getStudents(
    @QueryParams() { page, limit, key: k, value }: Order & Paging
  ): Promise<Partial<Pagination<Partial<Student[]>>>> {
    const key = studentColumnMapper[k];
    return this.studentService.getStudentsAndCount(
      { page, limit },
      { key, value }
    );
  }

  @Authorized()
  @Get('/current-student')
  async getCurrentStudent(
    @CurrentUser() student: Student
  ): Promise<DataResponse<Student>> {
    return this.studentService.getCurrentStudent(student);
  }

  @Authorized()
  @Get('/enrolled-students')
  async getEnrolledStudents(): Promise<DataResponse<Student[]>> {
    return this.studentService.getEnrolledStudents();
  }

  @Get('/:id')
  async getStudent(@Param('id') id: string): Promise<DataResponse<Student>> {
    return this.studentService.findById(id);
  }

  @Get('/student-id/:studentId')
  async getStudentByStudentId(
    @Param('studentId') studentId: string
  ): Promise<DataResponse<Student>> {
    return this.studentService.getStudentByStudentId(studentId);
  }

  @Post('/register')
  async createStudent(
    @Body() input: StudentInput
  ): Promise<Partial<DataResponse<Student>>> {
    return this.studentService.create(input);
  }

  @Authorized()
  @Patch('/current-student')
  async updateCurrentStudent(
    @CurrentUser() authUser: Student,
    @Body() input: Input<StudentInput>
  ): Promise<DataResponse<Student>> {
    return this.studentService.update(authUser.id, input, authUser);
  }

  @Authorized()
  @Patch('/reset-password')
  async resetPassword(
    @CurrentUser() student: Student,
    @Body() { oldPassword, newPassword }: ResetPasswordInput
  ): Promise<DeleteResponse> {
    return this.studentService.resetPassword(student, oldPassword, newPassword);
  }

  @Authorized()
  @Patch('/:id')
  async updateStudent(
    @Param('id') id: string,
    @CurrentUser() student: AuthUser,
    @Body() input: Input<StudentInput>
  ): Promise<Partial<DataResponse<Student>>> {
    return this.studentService.update(id, input, student);
  }

  @Authorized()
  @Delete('/:id')
  async deleteStudent(
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string
  ): Promise<DeleteResponse> {
    return this.studentService.deleteById(id, authUser);
  }
}
