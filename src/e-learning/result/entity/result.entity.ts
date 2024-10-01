import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../core/base/base-entity';
import { Quiz } from '../../quiz/entity/quiz.entity';
import { Student } from '../../students/entity/student.entity';

@Entity({ name: 'result' })
export class Result extends BaseEntity {
  @Column('int', { nullable: false })
  score: number;

  @ManyToOne(() => Student, { eager: true, cascade: true })
  @Index('IDX_Result_student')
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Quiz, (quiz) => quiz, { eager: true, cascade: true })
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
