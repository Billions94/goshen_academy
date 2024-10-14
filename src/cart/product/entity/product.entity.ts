import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/base/base-entity';
import { Course } from '../../../e-learning/course/entity/course.entity';
import { Lesson } from '../../../e-learning/lessons/lesson/entity/lesson.entity';
import { ProductType } from '../../service/interface';

@Entity()
@Index('IDX_Course', ['id'])
export class Product extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type: ProductType;

  @ManyToOne(() => Course, { nullable: true })
  @Index('IDX_Course')
  @JoinColumn({ name: 'courseId' })
  course: Course | null;

  @ManyToOne(() => Lesson, { nullable: true })
  @Index('IDX_Lesson')
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson | null;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;
}
