import bcryptService from 'bcrypt';
import { Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import { StudentRepository } from '../../e-learning/students/repository/studentRepository';
import process from 'process';

/**
 * Credential manager for verifying User entities credentials
 */
@Service()
export class CredentialManager {
  @Inject
  private static readonly studentRepository: StudentRepository;

  /**
   * @remarks This is a custom method.
   * Returns a user if it exists in the database or datasource provided
   * the credential verification criteria is met.
   * @param email - Email for user entity saved in the database or datasource.
   * @param password - Password for user entity saved in the database or datasource.
   * @returns A promise of a type <User | null | undefined>.
   * @beta
   */
  public static async verifyCredentials(email: string, password: string) {
    const student = await this.studentRepository.findByEmail(email);
    console.log(student?.getPassword());

    if (student) {
      if (await bcryptService.compare(password, student.getPassword()))
        return student;
      else return null;
    }
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcryptService.hash(password, 12);
  }
}
