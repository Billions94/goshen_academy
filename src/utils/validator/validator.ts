import { Inject } from 'typescript-ioc';
import { StudentRepository } from '../../e-learning/students/repository/studentRepository';
import { StudentInput } from '../../e-learning/students/interface';
import { ErrorMapper } from '../mapper/errorMapper';
import { ErrorResponse } from '../../interfaces';
import { Service } from 'typedi';

@Service()
export class Validator {
  //@Inject
  //private static readonly studentRepository: StudentRepository;
  @Inject
  private static readonly customErrorResponse: ErrorMapper;

  /**
   * @remarks This is a custom method.
   * Throws specific input field errors if the field is empty or
   * if the field does not meet the required validation criteria.
   * @param input - A set of input fields to be validated.
   * @returns A promise of type void.
   */
  public static validateRegisterInput(input: StudentInput) {
    if (input.firstName?.trim().length <= 0)
      throw new Error('Firstname field cannot be empty');

    if (input.lastName?.trim().length <= 0)
      throw new Error('Lastname field cannot be empty');

    if (input.age <= 0) throw new Error('Age field cannot be zero or negative');

    if (input.email?.trim().length <= 0)
      throw new Error('Email field cannot be empty');

    if (input.password?.trim().length <= 0)
      throw new Error('Password field cannot be empty');

    if (input.confirmPassword?.trim().length <= 0)
      throw new Error('Confirm Password field cannot be empty');

    if (input.confirmPassword !== input.password)
      throw new Error('Passwords do not match');
  }

  /**
   * @remarks This is a custom method.
   * Throws an error if an email already exists in a connected
   * database or datasource
   * @param email - An email to compare with an existing email in
   * a connected database or datasource
   * @returns A promise of type void.
   */
  // public static async isExistsByEmail(email: string): Promise<void> {
  //   if ((await this.studentRepository.isExistByEmail(email))?.email === email)
  //     throw new Error('Email already exists');
  // }

  /**
   * @remarks This is a custom method.
   * Throws an error for an entity passed as param, if they do not exist.
   * The id has to be from the entity passed as matcher.
   * @param id - Identifier for the entity e.g. x.id, with x being the entity.
   * @param matcher - Matcher or alias for the entity in lowercase
   * e.g. 'user' or 'post' or 'space'
   * @returns A promise of type void.
   * @beta
   */
  //   public static async throwErrorIfNotExist(
  //     id: number,
  //     matcher?: string
  //   ): Promise<Partial<ErrorResponse | undefined>> {
  //     switch (matcher) {
  //       case 'student':
  //         const student = await this.studentRepository.isExists(id);
  //         if (!student) {
  //           return this.customErrorResponse.throw('entity not found', 400);
  //         }
  //         break;
  //       default:
  //         return this.customErrorResponse.throw(
  //           'Generic error could not determine error Object',
  //           500
  //         );
  //     }
  //   }
  // }
}
