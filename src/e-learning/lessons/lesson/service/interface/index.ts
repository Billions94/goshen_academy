import { Pagination } from '../../../../interfaces';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { LessonInput } from '../../interface';

export interface LessonServiceInterface {
  createLesson(input: LessonInput): Promise<DataResponse>;
  getLessons(): Promise<Partial<Pagination>>;
  getLesson(id: number): Promise<DataResponse>;
  updateLesson(id: number, input: LessonInput): Promise<DataResponse>;
  deleteLesson(id: number): Promise<DeleteResponse>;
}
