import { Service } from 'typedi';
import { Course } from '../../../../../e-learning/course/entity/course.entity';
import { Lesson } from '../../../../../e-learning/lessons/lesson/entity/lesson.entity';
import { Quiz } from '../../../../../e-learning/quiz/entity/quiz.entity';
import { Student } from '../../../../../e-learning/students/entity/student.entity';
import { studentResponseMapper } from '../../../../../e-learning/students/mapper/studentResponseMapper';

@Service()
export class CourseDto {
  title: string;
  description: string;
  students: Partial<Student>[];
  lessons: Partial<Lesson[]>;
  completedAt: Date | null;
  isCompleted: boolean | null;
  isLatest: boolean | null;
  quizzes: Quiz[];

  constructor(course: Course[]) {
    if (Array.isArray(course)) {
      this.mapFromEntities(course);
    } else this.mapFromEntity(course);
  }

  public mapFromEntity(course: Course): CourseDto {
    this.title = course.title;
    this.description = course.description;
    this.students = this.students.map((student) =>
      studentResponseMapper(<Student>student)
    );
    this.lessons = course.lessons;
    this.completedAt = course.completedAt;
    this.isCompleted = course.isCompleted;
    this.isLatest = course.isLatest;
    this.quizzes = course.quizzes;
    return this;
  }

  public mapFromEntities(courses: Course[]): CourseDto[] {
    return courses.map((course) => this.mapFromEntity(course));
  }
}
