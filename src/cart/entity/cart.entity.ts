import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntry } from '../../core/base/base-time-entry';
import { Student } from '../../e-learning/students/entity/student.entity';
import { Product } from '../product/entity/product.entity';

@Entity('cart')
@Index('IDX_Cart', ['id', 'productName'])
export class Cart extends BaseTimeEntry {
  @Column()
  productName: string;

  @ManyToOne(() => Product, (product) => product.course, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Index('IDX_Product')
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Student, (student) => student.cart, {
    onDelete: 'CASCADE',
  })
  @Index('IDX_Student')
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column('int', { default: 0 })
  quantity: number;

  @Column('timestamptz', { nullable: true, default: null })
  deletedAt: Date | null;
}
