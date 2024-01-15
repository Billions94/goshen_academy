import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Student' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'studentId', length: 250, nullable: false })
  studentId: string;
  @Column('varchar', { name: 'firstName', length: 250, nullable: false })
  firstName: string;
  @Column('varchar', { name: 'lastName', length: 250, nullable: false })
  lastName: string;
  @Column('varchar', { name: 'nationality', length: 250, nullable: true })
  nationality: string;
  @Column('varchar', { name: 'address', length: 250, nullable: true })
  address: string;
  @Column('int', { name: 'age', nullable: false })
  age: number;
  @Index({ unique: true })
  @Column('varchar', { name: 'email', length: 250, nullable: false })
  email: string;
  @Column('varchar', { name: 'password', length: 250, nullable: true })
  private password: string;
  @Column('varchar', { name: 'refreshToken', length: 250, nullable: true })
  refreshToken: string | null;
  @Column('timestamptz', { name: 'createdAt', nullable: false })
  createdAt: string | Date;
  @Column('timestamptz', { name: 'updatedAt', nullable: true })
  updatedAt: string | Date;

  @BeforeInsert()
  setStudentId() {
    this.studentId = Math.ceil(Math.random() * 10000) + 'GA';
  }

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    console.log(
      'updated <---------------------------------------------------------------'
    );
    this.updatedAt = new Date();
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
