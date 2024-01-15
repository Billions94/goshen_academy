import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Student } from '../entity/student';
import { DataBase } from '../../../db/init';
import { StudentInput } from '../interface';

@Service()
export class StudentRepository extends Repository<Student> {
  constructor() {
    super(Student, DataBase.dataSource.createEntityManager());
  }

  async getStudents(): Promise<Student[]> {
    return await this.find();
  }

  async findByEmail(email: string): Promise<Student | null> {
    return await this.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Student> {
    return (await this.findOne({ where: { id } })) as Student;
  }

  async getStudent(id: number): Promise<Student | null> {
    return await this.findOne({ where: { id } });
  }

  async deleteStudent(id: number): Promise<void> {
    await this.delete({ id });
  }

  async updateStudent(id: number, updateInput: StudentInput): Promise<Student> {
    await this.update({ id }, updateInput);
    const student = await this.findOne({ where: { id } });

    console.log(student, updateInput);

    if (student) {
      await this.createQueryBuilder('student')
        .update(student)
        .set({ updatedAt: new Date() })
        .execute();

      return (await this.findOne({ where: { id } }).then(
        (std) => std
      )) as Student;
    }

    return {} as any;
  }

  async isExistByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email: email } });
  }

  async isExists(id: number): Promise<boolean> {
    const existing = await this.findOne({ where: { id: id } });
    return !!existing;
  }
}
