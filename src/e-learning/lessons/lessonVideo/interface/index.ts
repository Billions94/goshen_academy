import { LessonVideo } from '../entity/lessonVideo';

export interface LessonVideoInput extends Omit<LessonVideo, 'id'> {}
