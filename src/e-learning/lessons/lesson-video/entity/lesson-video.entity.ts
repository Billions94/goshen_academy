import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntry } from '../../../../core/base/base-time-entry';
import { Lesson } from '../../lesson/entity/lesson.entity';

@Index('IDX_Lesson_Video_tb', ['id'], { unique: true })
@Entity({ name: 'lesson_video' })
export class LessonVideo extends BaseTimeEntry {
  @Index('IDX_LessonVideo_url')
  @Column('text', { nullable: false })
  url: string;

  @Column('int', { nullable: false })
  duration: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.videos, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Index('IDX_LessonVideo_lesson')
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;
}
