import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../e-learning/base/base-entity';
import { Lesson } from '../../lesson/entity/lesson';

@Entity({ name: 'lesson_video' })
export class LessonVideo extends BaseEntity {
  @Column('varchar', { nullable: true })
  title: string;

  @Column('varchar', { nullable: false })
  url: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.videos, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
