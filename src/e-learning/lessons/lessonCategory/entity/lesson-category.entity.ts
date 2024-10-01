import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseTimeEntry } from '../../../../core/base/base-time-entry';
import { Lesson } from '../../lesson/entity/lesson.entity';

@Entity({ name: 'lesson_category' })
export class LessonCategory extends BaseTimeEntry {
  @Index('IDX_LessonCategory_name')
  @Column('varchar', { nullable: false, length: 100 })
  name: string;

  @Column('varchar', { nullable: false })
  description: string;

  @OneToMany(() => Lesson, (lesson) => lesson.category)
  lessons: Lesson[];
}
