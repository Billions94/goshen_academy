import { Lesson } from '../../entity/lesson';
import { LessonInput } from '../../../interface';
import {
  DataResponse,
  DeleteResponse,
} from '../../../../../interfaces/response';

export interface LessonServiceInterface {
  createLesson(input: LessonInput): Promise<DataResponse>;
  getLessons(): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson>;
  updateLesson(id: number, input: LessonInput): Promise<DataResponse>;
  deleteLesson(id: number): Promise<DeleteResponse>;
}
