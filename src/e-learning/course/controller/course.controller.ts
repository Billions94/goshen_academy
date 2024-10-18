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
import { AuthUser } from '../../../auth/interface';
import {
  Input,
  Order,
  Pagination,
  Paging,
} from '../../../e-learning/interfaces';
import { DataResponse } from '../../../e-learning/interfaces/response';
import { Course } from '../entity/course.entity';
import { CourseService } from '../service/course.service';
import { CreateCourseInput } from '../service/interface/create-course.input';

@Service()
@JsonController('/courses')
export class CourseController {
  @Inject()
  private readonly courseService: CourseService;

  @Authorized()
  @Post()
  async createCourse(
    @CurrentUser() authUser: AuthUser,
    @Body() courseInput: Input<CreateCourseInput>
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
  @Get('/:courseId')
  async getCourse(
    @Param('courseId') courseId: string
  ): Promise<DataResponse<Course>> {
    return this.courseService.findById(courseId);
  }

  @Authorized()
  @Patch('/:courseId')
  async updateCourse(
    @CurrentUser() authUser: AuthUser,
    @Param('courseId') courseId: string,
    @Body() courseInput: Input<Course>
  ): Promise<DataResponse<Course>> {
    return this.courseService.update(courseId, courseInput, authUser);
  }

  @Authorized()
  @Delete('/:courseId')
  async deleteCourse(
    @CurrentUser() authUser: AuthUser,
    @Param('courseId') courseId: string
  ): Promise<MessageStatus> {
    return this.courseService.deleteById(courseId, authUser);
  }
}
