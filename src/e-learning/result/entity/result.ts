import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from '../../../e-learning/quiz/entity/quiz';
import { Student } from '../../students/entity/student';

@Entity({ name: 'result' })
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'score', nullable: false })
  score: number;

  @ManyToOne(() => Student, { eager: true, cascade: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Quiz, (quiz) => quiz, { eager: true, cascade: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column('timestamptz', { name: 'date', nullable: false })
  date: Date | string;

  @BeforeInsert()
  setDate(): void {
    this.date = new Date();
  }
}
