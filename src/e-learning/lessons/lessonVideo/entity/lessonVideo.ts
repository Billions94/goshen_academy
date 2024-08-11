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

  @ManyToOne(() => Lesson, (lesson) => lesson, { cascade: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column('varchar', { name: 'description', nullable: false })
  videoFile: string;
}
