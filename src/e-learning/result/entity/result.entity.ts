import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseTimeEntry } from '../../../core/base/base-time-entry';
import { Quiz } from '../../quiz/entity/quiz.entity';
import { Student } from '../../students/entity/student.entity';

@Index('IDX_Result_tb', ['id'], { unique: true })
@Entity({ name: 'result' })
export class Result extends BaseTimeEntry {
  @Column('int', { nullable: false })
  score: number;

  @ManyToOne(() => Student, (student) => student.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Index('IDX_Result_student')
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Quiz, (quiz) => quiz, { eager: true, onDelete: 'CASCADE' })
  @Index('IDX_Result_quiz')
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column('timestamptz', { name: 'date', nullable: false })
  date: Date | string;

  @BeforeInsert()
  setDate(): void {
    this.date = new Date();
  }
}
