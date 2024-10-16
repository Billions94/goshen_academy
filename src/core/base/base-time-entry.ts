import { BeforeInsert, Column } from 'typeorm';
import { BaseEntity } from './base-entity';

export class BaseTimeEntry extends BaseEntity {
  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz', { nullable: true })
  updatedAt?: Date | null;

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }
}
