import { Student } from '../../../../students/entity/student.entity';

export interface LessonServiceInterface {
  getStudentFromLesson(
    studentIds: string | string[]
  ): Promise<Student | undefined>;
}
