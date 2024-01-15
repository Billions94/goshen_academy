import { Inject } from 'typescript-ioc';
import { StudentService } from '../service/studentService';
import {
  ContextRequest,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
} from 'typescript-rest';
import { Student } from '../entity/student';
import { StudentInput } from '../interface';
import { DataResponse, DeleteResponse } from '../../../interfaces/response';
import { LoginInput } from '../../../interfaces';
import { TokenResponse } from '../../../auth/interface';
import { Request } from 'express';

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
  async getStudent(@PathParam('id') id: number): Promise<DataResponse> {
    return this.studentService.getStudent(id);
  }

  @PATCH
  @Path(':id')
  async updateStudent(
    @PathParam('id') id: number,
    @ContextRequest { user }: Request,
    input: StudentInput
  ): Promise<Partial<DataResponse>> {
    console.log({ user });
    return this.studentService.updateStudent(id, input);
  }

  @DELETE
  @Path(':id')
  async deleteStudent(@PathParam('id') id: number): Promise<DeleteResponse> {
    return this.studentService.deleteStudent(id);
  }
}
