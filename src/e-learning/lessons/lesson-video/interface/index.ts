import { LessonVideo } from '../entity/lesson-video.entity';

export interface LessonVideoInput extends Omit<LessonVideo, 'id'> {}
