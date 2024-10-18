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
  UploadedFile,
} from 'routing-controllers';
import { AuthUser } from 'src/auth/interface';
import { Inject, Service } from 'typedi';
import { MulterFile, multerOptions } from '../../../utils/config/options';
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

  @Post('/register')
  async createStudent(
    @Body() input: StudentInput
  ): Promise<Partial<DataResponse<Student>>> {
    return this.studentService.create(input);
  }

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

  @Get('/:studentId')
  async getStudent(
    @Param('studentId') studentId: string
  ): Promise<DataResponse<Student>> {
    return this.studentService.findById(studentId);
  }

  @Get('/student-id/:studentId')
  async getStudentByStudentId(
    @Param('studentId') studentId: string
  ): Promise<DataResponse<Student>> {
    return this.studentService.getStudentByStudentId(studentId);
  }

  @Authorized()
  @Patch('/current-student')
  async updateCurrentStudent(
    @UploadedFile('image', { options: multerOptions() }) image: MulterFile,
    @CurrentUser() authUser: Student,
    @Body() input: Input<StudentInput>
  ): Promise<DataResponse<Student>> {
    return this.studentService.update(
      authUser.id,
      { ...input, image: image.path },
      authUser
    );
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
  @Patch('/:studentId')
  async updateStudent(
    @Param('studentId') studentId: string,
    @CurrentUser() student: AuthUser,
    @Body() input: Input<StudentInput>
  ): Promise<Partial<DataResponse<Student>>> {
    return this.studentService.update(studentId, input, student);
  }

  @Authorized()
  @Delete('/:studentId')
  async deleteStudent(
    @CurrentUser() authUser: AuthUser,
    @Param('studentId') studentId: string
  ): Promise<DeleteResponse> {
    return this.studentService.deleteById(studentId, authUser);
  }
}
