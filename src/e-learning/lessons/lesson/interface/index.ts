import { Lesson } from '../entity/lesson';

export interface LessonInput extends Omit<Lesson, 'id'> {
  studentIds: number | number[];
}
