import { Column } from 'typeorm';
import { BaseEntity } from './base-entity';

export class BaseTimeEntry extends BaseEntity {
  @Column('timestamptz', {
    nullable: false,
    default: new Date(),
  })
  createdAt: Date;

  @Column('timestamptz', { nullable: true })
  updatedAt?: Date | null;
}
