import { Course } from '../../entity/course.entity';

export class CreateCourseInput extends Course {
  studentId?: string;
  studentIds?: string[];
  lessonId?: string;
  lessonIds?: string[];
}
