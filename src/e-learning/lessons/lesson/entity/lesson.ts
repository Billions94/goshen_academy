import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseTimeEntry } from '../../../../e-learning/base/base-time-entry';
import { Quiz } from '../../../../e-learning/quiz/entity/quiz';
import { Student } from '../../../../e-learning/students/entity/student';
import { LessonCategory } from '../../lessonCategory/entity/lessonCategory';
import { LessonVideo } from '../../lessonVideo/entity/lessonVideo';

@Entity({ name: 'lesson' })
export class Lesson extends BaseTimeEntry {
  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @Column('varchar', { name: 'contents', nullable: false })
  contents: string;

  @ManyToMany(() => Student, (student) => student.lessons, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'student_lessons',
    joinColumn: {
      name: 'lesson_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'student_id',
      referencedColumnName: 'id',
    },
  })
  students: Partial<Student[]>;

  @ManyToOne(() => LessonCategory, (category) => category.lessons, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: LessonCategory;

  @OneToMany(() => LessonVideo, (video) => video.lesson)
  videos: LessonVideo[];

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];
}
