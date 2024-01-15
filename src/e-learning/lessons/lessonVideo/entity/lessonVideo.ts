import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from '../../lesson/entity/lesson';

@Entity({ name: 'LessonVideo' })
export class LessonVideo {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Lesson, (lesson) => lesson, { cascade: true })
  lesson: Lesson;
  @Column('varchar', { name: 'description', nullable: false })
  videoFile: string;
}
