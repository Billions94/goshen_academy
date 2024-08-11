import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from '../../lessons/lesson/entity/lesson';
import { Student } from '../../students/entity/student';

@Entity({ name: 'result' })
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Student, { eager: true, cascade: true })
  @JoinColumn({ name: 'student_id' })
  studentId: Student;

  @ManyToOne(() => Lesson, (lesson) => lesson, { eager: true, cascade: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column('int', { name: 'score', nullable: false })
  score: number;

  @Column('int', { name: 'total_item', nullable: false })
  totalItem: number;

  @Column('timestamptz', { name: 'date', nullable: false })
  date: Date | string;

  @BeforeInsert()
  setDate(): void {
    this.date = new Date();
  }
}
