import { LessonVideo } from '../../entity/lesson-video.entity';

export interface LessonVideoInterface {
  getLessonVideos(): Promise<LessonVideo[]>;
}
