import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from '../../lessons/lesson/entity/lesson';

@Entity({ name: 'quiz' })
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'question', nullable: false })
  question: string;

  @Column('text', { name: 'answer_1', nullable: false })
  answer_1: string;

  @Column('text', { name: 'answer_2', nullable: false })
  answer_2: string;

  @Column('text', { name: 'answer_3', nullable: false })
  answer_3: string;

  @Column('text', { name: 'answer_4', nullable: false })
  answer_4: string;

  @Column('text', { name: 'correct_answer', nullable: false })
  correctAnswer: string;

  @ManyToOne(() => Lesson, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
