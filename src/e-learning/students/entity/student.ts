import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from '../../../e-learning/lessons/lesson/entity/lesson';

@Entity({ name: 'student' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('varchar', {
    name: 'student_id',
    length: 50,
    nullable: false,
    unique: true,
  })
  studentId: string;

  @Column('varchar', { name: 'first_name', length: 50, nullable: false })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 50, nullable: false })
  lastName: string;

  @Column('varchar', { name: 'nationality', length: 50, nullable: true })
  nationality: string;

  @Column('varchar', { name: 'address', length: 150, nullable: true })
  address: string;

  @Column('date', { name: 'date_of_birth', nullable: false })
  dateOfBirth: Date;

  @Index({ unique: true })
  @Column('varchar', { name: 'email', length: 50, nullable: true })
  email: string;

  @ManyToMany(() => Lesson, (lesson) => lesson.students)
  lessons: Lesson[];

  @Column('varchar', { name: '', length: 300, nullable: true })
  image: string;

  @Column('varchar', { name: 'password', length: 250, nullable: true })
  private password: string;

  @Column('varchar', { name: 'refresh_token', length: 250, nullable: true })
  refreshToken: string | null;

  @Column('timestamptz', { name: 'created_at', nullable: true })
  createdAt: string | Date;

  @Column('timestamptz', { name: 'updated_at', nullable: true })
  updatedAt: string | Date;

  @Column('boolean', { name: 'is_admin', nullable: true, default: false })
  isAdmin: boolean;

  @BeforeInsert()
  setStudentId() {
    this.studentId = Math.ceil(Math.random() * 10000) + 'GA';
  }

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  setPassword(password: string) {
    this.password = password;
  }

  getPassword() {
    return this.password;
  }

  setRefreshToken(refreshToken: string | null) {
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }

    this.refreshToken = null;
  }

  getRefreshToken() {
    return this.refreshToken;
  }
}
