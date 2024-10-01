import { LessonCategory } from '../entity/lesson-category.entity';

export interface LessonCategoryInput extends Omit<LessonCategory, 'id'> {}
