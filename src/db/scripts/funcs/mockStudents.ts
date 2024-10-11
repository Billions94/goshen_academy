import * as bcryptService from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DataBase } from '../../../db/init'; // Import the Gender enum
import { Student } from '../../../e-learning/students/entity/student.entity';
import { Gender } from '../../../e-learning/students/interface';
import { pictureRandomizer } from '../../../utils/helper/picture-randomizer';
import Logger from '../../../utils/logger/logger';
import { firstNames, lastNames, nationalities, streets } from './data';

// Define a list of common feminine names based on the given firstNames array
const feminineNames = ['Jane', 'Emily', 'Sarah', 'Emma', 'Olivia'];

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomPhone(): string {
  return `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(
    Math.random() * 900 + 100
  )}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export async function insertStudents(count = 50) {
  const userRepository = DataBase.dataSource?.getRepository(Student);

  const students: Student[] = [];
  const usedStudentIds = new Set<string>(); // To ensure unique student_ids
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    let studentId: string;
    let email: string;

    const student = new Student();

    student.id = uuidv4();
    student.firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    student.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Assign gender based on the first name
    student.gender = feminineNames.includes(student.firstName)
      ? Gender.FEMALE
      : Gender.MALE;

    do {
      studentId = `S${Math.floor(Math.random() * 100000)}`;
    } while (usedStudentIds.has(studentId));
    usedStudentIds.add(studentId);

    do {
      email = `${student?.firstName?.toLowerCase()}.${student.lastName?.toLowerCase()}${Math.floor(
        Math.random() * 1000
      )}@example.com`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    student.email = email;
    student.createdAt = new Date();
    student.updatedAt = null;
    student.studentId = studentId;
    student.nationality =
      nationalities[Math.floor(Math.random() * nationalities.length)];
    student.address = `${Math.floor(Math.random() * 1000)} ${
      streets[Math.floor(Math.random() * streets.length)]
    }`;
    student.dateOfBirth = randomDate(
      new Date(1990, 0, 1),
      new Date(2000, 11, 31)
    );
    student.image = pictureRandomizer(count)[i];
    student.setPassword(await bcryptService.hash('123456', 12));
    student.refreshToken = `refresh_token_${i + 1}`;
    student.isAdmin = false;
    student.phone = randomPhone();
    student.enrollmentDate = randomDate(
      new Date(2019, 0, 1),
      new Date(2023, 11, 31)
    );

    students.push(student);
  }

  await userRepository.save(students);

  Logger.info(`Inserted ${count} students`);
}

insertStudents().catch((error) => Logger.error(error));
