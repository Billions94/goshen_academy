import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseTimeEntry } from '../../../../core/base/base-time-entry';
import { ParticipationProperty } from '../../../../core/base/interfaces';
import { Course } from '../../../../e-learning/course/entity/course.entity';
import { LessonCategory } from '../../lesson-category/entity/lesson-category.entity';
import { LessonVideo } from '../../lesson-video/entity/lesson-video.entity';

@Index('IDX_Lesson_tb', ['id'], { unique: true })
@Entity({ name: 'lesson' })
export class Lesson extends BaseTimeEntry implements ParticipationProperty {
  @Index('IDX_Lesson_name')
  @Column('varchar', { nullable: false, length: 100 })
  name: string;

  @Column('text', { nullable: false })
  contents: string;

  @ManyToOne(() => LessonCategory, (category) => category.lessons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Index('IDX_Lesson_category')
  @JoinColumn({ name: 'lessonCategoryId' })
  category: LessonCategory;

  @ManyToOne(() => Course, (course) => course.lessons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Index('IDX_Lesson_course')
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => LessonVideo, (video) => video.lesson)
  videos: LessonVideo[];

  @Column('timestamptz', { nullable: true })
  completedAt: Date | null;

  @Column('boolean', { nullable: true, default: false })
  isCompleted: boolean | null;
}
