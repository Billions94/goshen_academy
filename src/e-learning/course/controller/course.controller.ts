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
import { MessageStatus } from 'src/core/abstract-entity-crud.service';
import { Inject, Service } from 'typedi';
import {
  Input,
  Order,
  Pagination,
  Paging,
} from '../../../e-learning/interfaces';
import { DataResponse } from '../../../e-learning/interfaces/response';
import { Student } from '../../../e-learning/students/entity/student.entity';
import { Course } from '../entity/course.entity';
import { CourseService } from '../service/course.service';

@Service()
@JsonController('/courses')
export class CourseController {
  @Inject()
  private readonly courseService: CourseService;

  @Authorized()
  @Post()
  async createCourse(
    @CurrentUser() authUser: Student,
    @Body() courseInput: Input<Course>
  ): Promise<DataResponse<Course>> {
    return this.courseService.create(courseInput, authUser);
  }

  @Get()
  async getCourses(
    @QueryParams()
    { page, limit, key, value, ...restParams }: Order & Paging
  ): Promise<Pagination<Course[]>> {
    return this.courseService.getCoursesAndCount(
      { page, limit },
      { key, value },
      restParams
    );
  }

  @Authorized()
  @Get('/:id')
  async getCourse(@Param('id') id: string): Promise<DataResponse<Course>> {
    return this.courseService.findById(id);
  }

  @Authorized()
  @Patch('/:id')
  async updateCourse(
    @CurrentUser() authUser: Student,
    @Param('id') id: string,
    @Body() courseInput: Input<Course>
  ): Promise<DataResponse<Course>> {
    return this.courseService.update(id, courseInput, authUser);
  }

  @Authorized()
  @Delete('/:id')
  async deleteCourse(@Param('id') id: string): Promise<MessageStatus> {
    return this.courseService.deleteById(id);
  }
}
