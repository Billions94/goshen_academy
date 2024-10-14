import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Cart } from '../../../cart/entity/cart.entity';
import { BaseTimeEntry } from '../../../core/base/base-time-entry';
import { Course } from '../../course/entity/course.entity';
import { Auth, Gender, Privilege } from '../interface';

@Index('IDX_Student_tb', ['id'], { unique: true })
@Entity({ name: 'student' })
export class Student extends BaseTimeEntry implements Auth {
  @Index({ unique: true })
  @Column('varchar', {
    name: 'student_id',
    length: 50,
    nullable: false,
    unique: true,
  })
  studentId: string;

  @Index('IDX_Student_firstName')
  @Column('varchar', { length: 50, nullable: false })
  firstName: string;

  @Index('IDX_Student_lastName')
  @Column('varchar', { length: 50, nullable: false })
  lastName: string;

  @Column('varchar', { length: 50, nullable: true })
  nationality: string | null;

  @Column('varchar', { length: 150, nullable: true })
  address: string | null;

  @Column('varchar', { length: 20, nullable: true })
  phone: string | null;

  @Index('IDX_Student_dateOfBirth')
  @Column('date', { nullable: false })
  dateOfBirth: Date;

  @Index('IDX_Student_email')
  @Column('varchar', {
    length: 50,
    nullable: true,
    unique: true,
  })
  email: string | null;

  @ManyToMany(() => Course, (course) => course.students, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'student_courses',
    joinColumn: {
      name: 'courseId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'studentId',
      referencedColumnName: 'id',
    },
  })
  courses: Course[];

  @Column('varchar', { length: 300, nullable: true })
  image: string | null;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column('simple-array', { nullable: false, default: [Privilege.READ] })
  privileges: Privilege[];

  @Column('varchar', { length: 250, nullable: true })
  private password: string;

  @Column('varchar', { length: 250, nullable: true })
  private secondaryPassword: string;

  @Column('varchar', { length: 250, nullable: true })
  refreshToken: string | null;

  @Column('boolean', { nullable: true, default: false })
  isAdmin: boolean;

  @Column('date', { nullable: true, default: null })
  enrollmentDate: Date | null;

  @OneToMany(() => Cart, (cart) => cart.student)
  cart: Cart[];

  @BeforeInsert()
  setStudentId() {
    this.studentId = Math.ceil(Math.random() * 10000) + 'GA';
  }

  setPassword(password: string) {
    this.password = password;
  }

  getPassword() {
    return this.password;
  }

  setSecondaryPassword(secondaryPassword: string) {
    this.secondaryPassword = secondaryPassword;
  }

  getSecondaryPassword() {
    return this.secondaryPassword;
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
