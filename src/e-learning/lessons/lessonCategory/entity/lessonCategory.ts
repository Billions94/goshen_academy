import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from '../../lesson/entity/lesson';

@Entity({ name: 'lesson_category' })
export class LessonCategory {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @Column('varchar', { name: 'description', nullable: false })
  description: string;

  @OneToMany(() => Lesson, (lesson) => lesson.category)
  lessons: Lesson[];
}
