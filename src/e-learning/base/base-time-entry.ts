import { Column } from 'typeorm';
import { BaseEntity } from './base-entity';

export class BaseTimeEntry extends BaseEntity {
  @Column('timestamptz', {
    name: 'created_at',
    nullable: true,
    default: new Date(),
  })
  createdAt: string | Date;

  @Column('timestamptz', { name: 'updated_at', nullable: true })
  updatedAt: string | Date;
}
