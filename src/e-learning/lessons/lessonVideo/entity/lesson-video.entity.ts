import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntry } from '../../../../core/base/base-time-entry';
import { Lesson } from '../../lesson/entity/lesson.entity';

@Entity({ name: 'lesson_video' })
export class LessonVideo extends BaseTimeEntry {
  @Index('IDX_LessonVideo_title')
  @Column('varchar', { nullable: true, length: 50 })
  title: string;

  @Index('IDX_LessonVideo_url')
  @Column('text', { nullable: false })
  url: string;

  @Column('int', { nullable: false })
  duration: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.videos, {
    cascade: true,
    eager: true,
  })
  @Index('IDX_LessonVideo_lesson')
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;
}
