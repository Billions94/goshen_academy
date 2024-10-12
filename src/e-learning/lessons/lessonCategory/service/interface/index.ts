import { LessonCategory } from '../../entity/lesson-category.entity';

export interface LessonCategoryServiceInterface<Entity> {
  getLessonCategories(): Promise<LessonCategory[]>;
}
