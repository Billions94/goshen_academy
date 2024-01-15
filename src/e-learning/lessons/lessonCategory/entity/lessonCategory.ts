import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LessonCategory' })
export class LessonCategory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'name', nullable: false })
  name: string;
  @Column('varchar', { name: 'description', nullable: false })
  description: string;
}
