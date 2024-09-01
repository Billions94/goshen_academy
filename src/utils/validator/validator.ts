import { Service } from 'typedi';
import { StudentInput } from '../../e-learning/students/interface';

@Service()
export class Validator {
  /**
   * @remarks This is a custom method.
   * Throws specific input field errors if the field is empty or
   * if the field does not meet the required validation criteria.
   * @param input - A set of input fields to be validated.
   * @returns A promise of type void.
   */
  public static validateRegisterInput(input: StudentInput) {
    if (this.isEmpty(input.firstName))
      throw new Error('Firstname field cannot be empty');

    if (this.isEmpty(input.lastName))
      throw new Error('Lastname field cannot be empty');

    if (input.dateOfBirth < new Date('1980-05-02'))
      throw new Error('Age field cannot be zero or negative');

    if (this.isEmpty(input.email))
      throw new Error('Email field cannot be empty');

    if (this.isEmpty(input.password))
      throw new Error('Password field cannot be empty');

    if (this.isEmpty(input.confirmPassword))
      throw new Error('Confirm Password field cannot be empty');

    if (input.confirmPassword !== input.password)
      throw new Error('Passwords do not match');
  }

  private static isEmpty(input: string): boolean {
    if (!input || input === undefined) return true;
    return input.trim().length <= 0;
  }
}
