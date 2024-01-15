import { Lesson } from '../lesson/entity/lesson';
import { LessonCategory } from '../lessonCategory/entity/lessonCategory';

export interface LessonInput extends Omit<Lesson, 'id'> {
  name: string;
  category: LessonCategory;
}
export interface LessonCategoryInput extends Omit<LessonCategory, 'id'> {}
