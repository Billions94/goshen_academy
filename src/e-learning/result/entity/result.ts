import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../e-learning/base/base-entity';
import { Quiz } from '../../../e-learning/quiz/entity/quiz';
import { Student } from '../../students/entity/student';

@Entity({ name: 'result' })
export class Result extends BaseEntity {
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
