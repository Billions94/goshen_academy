import bcryptService from 'bcrypt';
import { Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import { StudentRepository } from '../../e-learning/students/repository/studentRepository';
import process from 'process';
import { Student } from '../../e-learning/students/entity/student';

/**
 * Credential manager for verifying Student entities credentials
 */
@Service()
export class CredentialManager {
  @Inject
  private static readonly studentRepository: StudentRepository;

  /**
   * @remarks This is a custom method.
   * Returns a Student if it exists in the database or datasource provided
   * the credential verification criteria is met.
   * @param email - Email for Student entity saved in the database or datasource.
   * @param password - Password for user entity saved in the database or datasource.
   * @returns A promise of a type <Student | null | undefined>.
   * @beta
   */
  public static async verifyCredentials(email: string, password: string) {
    const student = await this.studentRepository.findByEmail(email);

    if (student) {
      if (await bcryptService.compare(password, student.getPassword()))
        return student;
      else return null;
    }
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcryptService.hash(password, 12);
  }

  public static async hashRefreshToken(
    refreshToken: string,
    student: Student
  ): Promise<void> {
    const hashedRefresh = await bcryptService.hash(
      refreshToken,
      parseInt(<string>process.env.SALT_FACTOR)
    );

    await this.studentRepository
      .createQueryBuilder()
      .update(student)
      .set({ refreshToken: hashedRefresh })
      .execute();
  }
}
