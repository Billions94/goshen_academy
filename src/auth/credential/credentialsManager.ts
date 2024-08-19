import bcryptService from 'bcrypt';
import process from 'process';
import { Inject, Service } from 'typedi';
import { Student } from '../../e-learning/students/entity/student';
import { StudentRepository } from '../../e-learning/students/repository/studentRepository';

/**
 * Credential manager for verifying Student entities credentials
 */
@Service()
export class CredentialManager {
  @Inject()
  private readonly studentRepository: StudentRepository;

  /**
   * @remarks This is a custom method.
   * Returns a Student if it exists in the database or datasource provided
   * the credential verification criteria is met.
   * @param email - Email for Student entity saved in the database or datasource.
   * @param password - Password for user entity saved in the database or datasource.
   * @returns A promise of a type <Student | null | undefined>.
   * @beta
   */
  public async verifyCredentials(email: string, password: string) {
    const student = await this.studentRepository.findByEmail(email);

    if (student) {
      if (await bcryptService.compare(password, student.getPassword()))
        return student;
      else return null;
    }
  }

  public async hashPassword(password: string): Promise<string> {
    return bcryptService.hash(password, 12);
  }

  public async hashRefreshToken(
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
