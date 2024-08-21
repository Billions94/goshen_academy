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
   * Verifies the credentials of a Student entity by comparing the hashed password.
   *
   * @remarks
   * This function retrieves a Student entity from the database based on the provided email.
   * It then compares the hashed version of the provided password with the stored hashed password in the database.
   * If the passwords match, the function returns the Student entity. Otherwise, it returns null.
   *
   * @param email - The email of the Student entity to verify.
   * @param password - The password to verify against the Student entity.
   * @returns A promise that resolves to the Student entity if the credentials are valid, or null otherwise.
   */
  public async verifyCredentials(email: string, password: string) {
    const student = await this.studentRepository.findByEmail(email);

    if (student) {
      if (await bcryptService.compare(password, student.getPassword()))
        return student;
      else return null;
    }
  }

  /**
   * Hashes a given password using bcrypt with a specified salt factor.
   *
   * @remarks
   * This function is used to securely store passwords in the database.
   * It takes a plain-text password and returns a hashed version of it.
   *
   * @param password - The plain-text password to be hashed.
   * @returns A promise that resolves to the hashed password.
   *
   * @beta
   */
  public async hashPassword(password: string): Promise<string> {
    return bcryptService.hash(password, 12);
  }

  /**
   * Hashes a refresh token for a given student and updates the student's record in the database.
   *
   * @remarks
   * This function is used to securely store refresh tokens associated with students in the database.
   * It takes a plain-text refresh token and a student entity, hashes the refresh token using bcrypt,
   * and then updates the student's record in the database with the hashed refresh token.
   *
   * @param refreshToken - The plain-text refresh token to be hashed.
   * @param student - The student entity for which the refresh token needs to be hashed and stored.
   * @returns A promise that resolves to void when the operation is complete.
   *
   * @beta
   */
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
