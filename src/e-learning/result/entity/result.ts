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

@Entity({ name: 'Result' })
export class Result {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Student, { eager: true, cascade: true })
  @JoinColumn()
  studentId: Student;
  @ManyToOne(() => Lesson, (lesson) => lesson, { eager: true, cascade: true })
  @JoinColumn()
  lesson: Lesson;
  @Column('int', { name: 'score', nullable: false })
  Score: number;
  @Column('int', { name: 'totalItem', nullable: false })
  totalItem: number;
  @Column('timestamptz', { name: 'date', nullable: false })
  date: Date | string;

  @BeforeInsert()
  setDate(): void {
    this.date = new Date();
  }
}
