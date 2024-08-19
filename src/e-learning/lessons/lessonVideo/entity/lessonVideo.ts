import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from '../../lesson/entity/lesson';

@Entity({ name: 'lesson_video' })
export class LessonVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'title', nullable: true })
  title: string;

  @Column('varchar', { name: 'url', nullable: false })
  url: string;

  @ManyToOne(() => Lesson, (lesson) => lesson, { cascade: true, eager: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
