import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Student } from '../entity/student';
import { DataBase } from '../../../db/init';
import { StudentInput } from '../interface';
import { studentResponseMapper } from '../mapper/studentResponseMapper';

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

  async updateStudent(
    id: number,
    updateInput: StudentInput,
    student?: Student
  ): Promise<Partial<Student>> {
    await this.createQueryBuilder()
      .update(await this.findById(id))
      .set({
        firstName: updateInput.firstName,
        lastName: updateInput.lastName,
        age: updateInput.age,
        email: updateInput.email,
        address: updateInput.address,
        nationality: updateInput.nationality,
        updatedAt: new Date(),
      })
      .where({ id })
      .execute();

    const updatedStudent = await this.findById(id);
    return studentResponseMapper(updatedStudent);
  }

  async isExistByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email: email } });
  }

  async isExists(id: number): Promise<boolean> {
    const existing = await this.findOne({ where: { id: id } });
    return !!existing;
  }
}
