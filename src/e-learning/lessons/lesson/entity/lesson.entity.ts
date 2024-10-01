import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseTimeEntry } from '../../../../core/base/base-time-entry';
import { ParticipationProperty } from '../../../../core/base/interfaces';
import { Course } from '../../../../e-learning/course/entity/course.entity';
import { Quiz } from '../../../quiz/entity/quiz.entity';
import { Student } from '../../../students/entity/student.entity';
import { LessonCategory } from '../../lessonCategory/entity/lesson-category.entity';
import { LessonVideo } from '../../lessonVideo/entity/lesson-video.entity';

@Entity({ name: 'lesson' })
export class Lesson extends BaseTimeEntry implements ParticipationProperty {
  @Index('IDX_Lesson_name')
  @Column('varchar', { nullable: false, length: 100 })
  name: string;

  @Column('text', { nullable: false })
  contents: string;

  @ManyToMany(() => Student, (student) => student.lessons, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'student_lessons',
    joinColumn: {
      name: 'lessonId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'studentId',
      referencedColumnName: 'id',
    },
  })
  students: Partial<Student[]>;

  @ManyToOne(() => LessonCategory, (category) => category.lessons, {
    eager: true,
    cascade: true,
  })
  @Index('IDX_Lesson_category')
  @JoinColumn({ name: 'categoryId' })
  category: LessonCategory;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @OneToMany(() => LessonVideo, (video) => video.lesson)
  videos: LessonVideo[];

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];

  @Column('timestamptz', { nullable: true })
  completedAt: Date | null;

  @Column('boolean', { nullable: true, default: false })
  isCompleted: boolean | null;
}
