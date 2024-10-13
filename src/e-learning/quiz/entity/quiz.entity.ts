import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntry } from '../../../core/base/base-time-entry';
import { Course } from '../../../e-learning/course/entity/course.entity';
import { Lesson } from '../../lessons/lesson/entity/lesson.entity';

@Index('IDX_Quiz_tb', ['id'], { unique: true })
@Entity({ name: 'quiz' })
export class Quiz extends BaseTimeEntry {
  @Column('text', { name: 'question', nullable: false })
  question: string;

  @Column('text', { name: 'answer_1', nullable: false })
  answer_1: string;

  @Column('text', { name: 'answer_2', nullable: false })
  answer_2: string;

  @Column('text', { name: 'answer_3', nullable: false })
  answer_3: string;

  @Column('text', { name: 'answer_4', nullable: false })
  answer_4: string;

  @Column('text', { name: 'correct_answer', nullable: false })
  correctAnswer: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Index('IDX_Quiz_lesson')
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @ManyToOne(() => Course, (course) => course.quizzes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
