import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { BaseTimeEntry } from '../../../core/base/base-time-entry';
import { ParticipationProperty } from '../../../core/base/interfaces';
import { Lesson } from '../../../e-learning/lessons/lesson/entity/lesson.entity';
import { Quiz } from '../../../e-learning/quiz/entity/quiz.entity';
import { Student } from '../../students/entity/student.entity';

@Entity('course')
export class Course extends BaseTimeEntry implements ParticipationProperty {
  @Index('IDX_Course_title', { unique: true })
  @Column({ nullable: false, length: 50 })
  title: string;

  @Column('text', { nullable: false })
  description: string;

  @ManyToMany(() => Student, (student) => student.courses)
  students: Partial<Student>[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Partial<Lesson[]>;

  @Column('timestamptz', { nullable: true })
  completedAt: Date | null;

  @Column('boolean', { nullable: true, default: false })
  isCompleted: boolean | null;

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];
}
