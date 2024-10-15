import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { AuthUser } from '../../../auth/interface';
import { DataBase } from '../../../db/init';

import { Student } from '../entity/student.entity';
import { SqlRawQueryMapperStudent } from '../interface';
import { studentResponseMapper } from '../mapper/studentResponseMapper';

@Service()
export class StudentRepository extends Repository<Student> {
  constructor() {
    super(Student, DataBase.dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<Student | null> {
    return await this.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Student> {
    return (await this.findOne({ where: { id } })) as Student;
  }

  async getStudent(id: string): Promise<Student | null> {
    return await this.findOne({ where: { id } });
  }

  async deleteStudent(id: string): Promise<void> {
    await this.delete({ id });
  }

  async getByStudentId(
    studentId: string
  ): Promise<SqlRawQueryMapperStudent | null> {
    return await this.createQueryBuilder('student')
      .where('student.student_id = :student_id ', {
        student_id: studentId,
      })
      .select(
        `student.id,
        student.first_name,
        student.last_name,
        student.nationality,
        student.created_at
        `
      )
      .execute()
      .then((raw) => ({ ...[raw][0] }[0]));
  }

  async updateStudent(
    id: string,
    updateInput: Partial<Student>,
    student: AuthUser
  ): Promise<Partial<Student>> {
    if (student.id !== id && student.isAdmin) {
      await this.createQueryBuilder()
        .update(await this.findById(id))
        .set({ ...updateInput })
        .where({ id })
        .execute();
      return studentResponseMapper(await this.findById(id));
    } else {
      await this.createQueryBuilder()
        .update(student)
        .set({ ...updateInput })
        .where({ id: student.id })
        .execute();
      return studentResponseMapper(await this.findById(id));
    }
  }

  async isExistByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email: email } });
  }

  async isExists(id: string): Promise<boolean> {
    const existing = await this.findOne({ where: { id: id } });
    return !!existing;
  }
}
