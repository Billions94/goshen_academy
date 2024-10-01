import { Order, Pagination, Paging } from '../../../../e-learning/interfaces';
import { Course } from '../../entity/course.entity';

export interface CourseServiceInterface {
  getCoursesAndCount(
    { page, limit }: Paging,
    order?: Order,
    where?: any
  ): Promise<Pagination<Course[]>>;
}
