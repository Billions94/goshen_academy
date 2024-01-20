import {
  DataResponse,
  DeleteResponse,
} from '../../../../../interfaces/response';
import { LessonVideo } from '../../entity/lessonVideo';
import { LessonVideoInput } from '../../interface';

export interface LessonVideoInterface {
  createLessonVideo(input: LessonVideoInput): Promise<DataResponse>;
  getLessonVideos(): Promise<LessonVideo[]>;
  getLessonVideo(id: number): Promise<DataResponse>;
  updateLessonVideo(id: number, input: LessonVideoInput): Promise<DataResponse>;
  deleteLessonVideo(id: number): Promise<DeleteResponse>;
}
