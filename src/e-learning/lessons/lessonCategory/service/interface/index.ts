import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonCategoryInput } from '../../../lessonCategory/interface';
import { LessonCategory } from '../../entity/lessonCategory';

export interface LessonCategoryServiceInterface {
  createLessonCategory(input: LessonCategoryInput): Promise<DataResponse>;
  getLessonCategories(): Promise<LessonCategory[]>;
  getLessonCategory(id: number): Promise<DataResponse>;
  updateLessonCategory(
    id: number,
    input: LessonCategoryInput
  ): Promise<DataResponse>;
  deleteLessonCategory(id: number): Promise<DeleteResponse>;
}
