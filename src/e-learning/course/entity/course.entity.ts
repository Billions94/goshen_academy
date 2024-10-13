import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { BaseTimeEntry } from '../../../core/base/base-time-entry';
import { ParticipationProperty } from '../../../core/base/interfaces';
import { CourseInvitation } from '../../../e-learning/course-invitation/entity/course-invitation.entity';
import { Lesson } from '../../../e-learning/lessons/lesson/entity/lesson.entity';
import { Quiz } from '../../../e-learning/quiz/entity/quiz.entity';
import { Student } from '../../students/entity/student.entity';

@Index('IDX_Course_tb', ['id'], { unique: true })
@Entity('course')
export class Course extends BaseTimeEntry implements ParticipationProperty {
  @Index('IDX_Course_title', { unique: true })
  @Column({ nullable: false, length: 50 })
  title: string;

  @Column('text', { nullable: false })
  description: string;

  @OneToMany(() => CourseInvitation, (invitation) => invitation.course)
  invitations: CourseInvitation[];

  @ManyToMany(() => Student, (student) => student.courses, {
    cascade: ['remove'],
  })
  students: Partial<Student>[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Partial<Lesson[]>;

  @Column('timestamptz', { nullable: true })
  startDate: Date | null;

  @Column('timestamptz', { nullable: true })
  completedAt: Date | null;

  @Column('boolean', { nullable: true, default: false })
  isCompleted: boolean | null;

  @Column('boolean', { nullable: true, default: false })
  isLatest: boolean | null;

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @Column('int', { nullable: true })
  participation: number | null;

  @Column('int', { nullable: true })
  progress: number | null;
}
