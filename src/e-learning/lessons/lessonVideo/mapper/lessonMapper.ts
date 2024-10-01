import { Student } from '../../../students/entity/student.entity';
import { studentResponseMapper } from '../../../students/mapper/studentResponseMapper';
import { Lesson } from '../../lesson/entity/lesson';

export const lessonResponseMapper = (lesson: Lesson): Partial<Lesson> => ({
  id: lesson.id,
  name: lesson.name,
  contents: lesson.contents,
  category: lesson.category,
  students: <Partial<Student[]>>lesson.students.map(studentResponseMapper),
});
