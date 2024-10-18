import { Service } from 'typedi';
import { CreateCourseInput } from '../../e-learning/course/service/interface/create-course.input';
import { Input } from '../../e-learning/interfaces';
import { LessonCategory } from '../../e-learning/lessons/lesson-category/entity/lesson-category.entity';
import { LessonVideo } from '../../e-learning/lessons/lesson-video/entity/lesson-video.entity';
import { Lesson } from '../../e-learning/lessons/lesson/entity/lesson.entity';
import { Quiz } from '../../e-learning/quiz/entity/quiz.entity';
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
  public static validateRegisterInput(input: Input<StudentInput>) {
    if (this.isEmpty(input.firstName))
      throw new Error('Firstname field cannot be empty');

    if (this.isEmpty(input.lastName))
      throw new Error('Lastname field cannot be empty');

    if (input.dateOfBirth === null)
      throw new Error('Date of Birth field cannot be empty');

    if (input.email && this.isEmpty(input.email))
      throw new Error('Email field cannot be empty');

    if (this.isEmpty(input.password))
      throw new Error('Password field cannot be empty');

    if (this.isEmpty(input.confirmPassword))
      throw new Error('Confirm Password field cannot be empty');

    if (input.confirmPassword !== input.password)
      throw new Error('Passwords do not match');

    if (this.isEmpty(input.secondaryPassword))
      throw new Error('Secondary Password field cannot be empty');

    if (this.isEmpty(input.confirmSecondaryPassword))
      throw new Error('Confirm Secondary Password field cannot be empty');
  }

  public static validateCourseInput(input: Input<CreateCourseInput>) {
    if (this.isEmpty(input.title))
      throw new Error('Title field cannot be empty');

    if (this.isEmpty(input.description))
      throw new Error('Description field cannot be empty');

    if (!input.students)
      throw new Error(
        'There must be students relation, please provide students relation.'
      );
    else if (!input.lessons)
      throw new Error(
        'There must be lessons relation, please provide lessons relation.'
      );
  }

  public static validateLessonCategoryInput(input: Input<LessonCategory>) {
    if (this.isEmpty(input.name)) throw new Error('Name field cannot be empty');

    if (this.isEmpty(input.description))
      throw new Error('Description field cannot be empty');

    if (!input.lessons)
      throw new Error(
        'There must be lessons relation, please provide lessons relation.'
      );
  }

  public static validateLessonInput(input: Input<Lesson>) {
    if (this.isEmpty(input.name)) throw new Error('Name field cannot be empty');

    if (this.isEmpty(input.contents))
      throw new Error('Contents field cannot be empty');
  }

  public static validateQuizInput(input: Input<Quiz>) {
    if (this.isEmpty(input.answer_1))
      throw new Error('Answer 1 field cannot be empty');

    if (this.isEmpty(input.answer_2))
      throw new Error('Answer 2 field cannot be empty');

    if (this.isEmpty(input.answer_3))
      throw new Error('Answer 3 field cannot be empty');

    if (this.isEmpty(input.answer_4))
      throw new Error('Answer 4 field cannot be empty');

    if (this.isEmpty(input.correctAnswer))
      throw new Error('Correct Answer field cannot be empty');

    if (this.isEmpty(input.question))
      throw new Error('Question field cannot be empty');

    if (!input.lesson)
      throw new Error(
        'There must be lesson relation, please provide lesson relation.'
      );
  }

  public static validateLessonVideoInput(input: Input<LessonVideo>) {
    if (this.isEmpty(input.url)) throw new Error('URL field cannot be empty');

    if (!input.lesson)
      throw new Error(
        'There must be lesson relation, please provide lesson relation.'
      );
  }

  private static isEmpty(input: string | undefined): boolean {
    if (!input || input === undefined) return true;
    return input.trim().length <= 0;
  }
}
