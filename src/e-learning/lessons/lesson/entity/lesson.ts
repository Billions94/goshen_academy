import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonCategory } from '../../lessonCategory/entity/lessonCategory';

@Entity({ name: 'Lesson' })
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'name', nullable: false })
  name: string;
  @Column('varchar', { name: 'contents', nullable: false })
  contents: string;
  @OneToOne(() => LessonCategory, (category) => category, { cascade: true })
  @JoinColumn()
  category: LessonCategory;
}
