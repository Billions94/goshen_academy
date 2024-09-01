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
import { Inject, Service } from 'typedi';
import { TokenResponse } from '../../../auth/interface';
import { LoginInput, Order, Pagination, Paging } from '../../interfaces';
import { DataResponse, DeleteResponse } from '../../interfaces/response';
import { Student } from '../entity/student';
import { StudentInput } from '../interface';
import { studentColumnMapper } from '../mapper/studentColumnKeyMapper';
import { StudentService } from '../service/studentService';

@Service()
@JsonController('/students')
export class StudentController {
  @Inject()
  private readonly studentService: StudentService;

  @Get()
  async getStudents(
    @QueryParams() params: Order & Paging
  ): Promise<Partial<Pagination<Partial<Student>>>> {
    const { page, limit, key: k = 'student.name', value = 'DESC' } = params;
    const key = studentColumnMapper[k];
    return this.studentService.getStudents({ page, limit }, { key, value });
  }

  @Authorized()
  @Get('/current-student')
  async getCurrentStudent(
    @CurrentUser() student: Student
  ): Promise<DataResponse> {
    return this.studentService.getCurrentStudent(student);
  }

  @Get('/:id')
  async getStudent(@Param('id') id: string): Promise<DataResponse> {
    return this.studentService.getStudent(parseInt(id));
  }

  @Get('/student-id/:studentId')
  async getStudentByStudentId(
    @Param('studentId') studentId: string
  ): Promise<DataResponse> {
    return this.studentService.getStudentByStudentId(studentId);
  }

  @Post('/register')
  async createStudent(
    @Body() input: StudentInput
  ): Promise<Partial<DataResponse>> {
    return this.studentService.createStudent(input);
  }

  @Post('/login')
  async login(@Body() input: LoginInput): Promise<Partial<TokenResponse>> {
    return this.studentService.login(input);
  }

  @Patch('/:id')
  async updateStudent(
    @Param('id') id: number,
    @CurrentUser() student: Student,
    @Body() input: Partial<StudentInput>
  ): Promise<Partial<DataResponse>> {
    return this.studentService.updateStudent(id, input, student);
  }

  @Delete('/:id')
  async deleteStudent(@Param('id') id: number): Promise<DeleteResponse> {
    return this.studentService.deleteStudent(id);
  }
}
