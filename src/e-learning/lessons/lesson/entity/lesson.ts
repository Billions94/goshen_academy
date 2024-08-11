import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonCategory } from '../../lessonCategory/entity/lessonCategory';

@Entity({ name: 'lesson' })
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @Column('varchar', { name: 'contents', nullable: false })
  contents: string;

  @ManyToOne(() => LessonCategory, (category) => category, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: LessonCategory;
}
