import { Request } from 'express';
import { Inject } from 'typescript-ioc';
import {
  ContextRequest,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
} from 'typescript-rest';
import { TokenResponse } from '../../../auth/interface';
import { LoginInput } from '../../../interfaces';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { Student } from '../entity/student';
import { StudentInput } from '../interface';
import { StudentService } from '../service/studentService';

@Path('api/students')
export class StudentController {
  @Inject
  private readonly studentService: StudentService;

  @POST
  @Path('register')
  async createStudent(input: StudentInput): Promise<Partial<DataResponse>> {
    return this.studentService.createStudent(input);
  }

  @POST
  @Path('login')
  async login(input: LoginInput): Promise<Partial<TokenResponse>> {
    return this.studentService.login(input);
  }

  @GET
  async getStudents(): Promise<Partial<Student[]>> {
    return this.studentService.getStudents();
  }

  @GET
  @Path(':id')
  async getStudent(@PathParam('id') id: string): Promise<DataResponse> {
    return this.studentService.getStudent(parseInt(id));
  }

  @GET
  @Path('student-id/:studentId')
  async getStudentByStudentId(
    @PathParam('studentId') studentId: string
  ): Promise<DataResponse> {
    console.log({ studentId });
    return this.studentService.getStudentByStudentId(studentId);
  }

  @PATCH
  @Path(':id')
  async updateStudent(
    @PathParam('id') id: number,
    @ContextRequest { user }: Request,
    input: StudentInput
  ): Promise<Partial<DataResponse>> {
    return this.studentService.updateStudent(id, input, <Student>user);
  }

  @DELETE
  @Path(':id')
  async deleteStudent(@PathParam('id') id: number): Promise<DeleteResponse> {
    return this.studentService.deleteStudent(id);
  }
}
