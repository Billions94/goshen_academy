import { LessonCategoryInput } from '../../../interface';
import {
  DataResponse,
  DeleteResponse,
} from '../../../../../interfaces/response';
import { LessonCategory } from '../../../lessonCategory/entity/lessonCategory';
import { LessonVideo } from '../../entity/lessonVideo';

export interface LessonVideoInterface {
  createLessonCategory(input: LessonCategoryInput): Promise<DataResponse>;
  getLessonCategories(): Promise<LessonVideo[]>;
  getLessonCategory(id: number): Promise<LessonVideo>;
  updateLessonCategory(
    id: number,
    input: LessonCategoryInput
  ): Promise<DataResponse>;
  deleteLessonCategory(id: number): Promise<DeleteResponse>;
}
