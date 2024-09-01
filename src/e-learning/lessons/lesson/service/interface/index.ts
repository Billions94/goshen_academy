import { Pagination } from '../../../../interfaces';
import { DataResponse, DeleteResponse } from '../../../../interfaces/response';
import { Lesson } from '../../entity/lesson';
import { LessonInput } from '../../interface';

export interface LessonServiceInterface {
  createLesson(input: LessonInput): Promise<DataResponse>;

  getLessons(): Promise<Partial<Pagination<Partial<Lesson>>>>;

  getLesson(id: number): Promise<DataResponse>;

  updateLesson(id: number, input: LessonInput): Promise<DataResponse>;

  deleteLesson(id: number): Promise<DeleteResponse>;
}
