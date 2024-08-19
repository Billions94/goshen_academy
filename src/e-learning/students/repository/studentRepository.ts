import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../db/init';
import { addPagination } from '../../../utils/helper/add-pagination';
import { Student } from '../entity/student';
import { Order, SqlRawQueryMapperStudent, StudentInput } from '../interface';
import { studentResponseMapper } from '../mapper/studentResponseMapper';

@Service()
export class StudentRepository extends Repository<Student> {
  constructor() {
    super(Student, DataBase.dataSource.createEntityManager());
  }

  /**
   * Retrieves a paginated list of students, ordered by the provided criteria.
   *
   * @param order - The order criteria, containing the key and value to sort by.
   * @param limit - The maximum number of students to return per page.
   * @param skip - The number of students to skip for pagination.
   *
   * @returns A Promise that resolves to an array of Student objects.
   *
   * @remarks
   * This function uses TypeORM's QueryBuilder to construct a query that retrieves students,
   * applies pagination, sorting, and caching. It also eagerly loads the related lessons for each student.
   */
  async getStudentsAndPaginate(
    order: Order,
    limit: number,
    skip: number
  ): Promise<Student[]> {
    const queryBuilder = this.createQueryBuilder('student');
    return await addPagination(queryBuilder, { limit, page: skip })
      .leftJoinAndSelect('student.lessons', 'lessons')
      .orderBy(`${order.key}`, `${order.value}`)
      .cache(25000)
      .getMany();
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

  async getByStudentId(
    studentId: string
  ): Promise<SqlRawQueryMapperStudent | null> {
    const queryBuilder = this.createQueryBuilder('student');

    return await queryBuilder
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
    id: number,
    updateInput: Partial<StudentInput>,
    student: Student
  ): Promise<Partial<Student>> {
    if (student.id !== id && student.isAdmin)
      await this.createQueryBuilder()
        .update(await this.findById(id))
        .set({
          firstName: updateInput.firstName,
          lastName: updateInput.lastName,
          dateOfBirth: updateInput.dateOfBirth,
          email: updateInput.email,
          address: updateInput.address,
          nationality: updateInput.nationality,
          updatedAt: new Date(),
        })
        .where({ id })
        .execute();
    else
      await this.createQueryBuilder()
        .update(student)
        .set({
          firstName: updateInput.firstName,
          lastName: updateInput.lastName,
          dateOfBirth: updateInput.dateOfBirth,
          email: updateInput.email,
          address: updateInput.address,
          nationality: updateInput.nationality,
          updatedAt: new Date(),
        })
        .where({ id: student.id })
        .execute();

    return studentResponseMapper(await this.findById(id));
  }

  async isExistByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email: email } });
  }

  async isExists(id: number): Promise<boolean> {
    const existing = await this.findOne({ where: { id: id } });
    return !!existing;
  }
}
