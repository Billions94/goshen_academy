import { LessonCategory } from '../entity/lessonCategory';

export interface LessonCategoryInput extends Omit<LessonCategory, 'id'> {}
