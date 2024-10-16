import { Inject, Service } from 'typedi';
import { LoginInput } from '../e-learning/interfaces';
import { Student } from '../e-learning/students/entity/student.entity';
import { StudentRepository } from '../e-learning/students/repository/student.repository';
import Logger from '../utils/logger/logger';
import { ErrorMapper } from '../utils/mapper/errorMapper';
import { CredentialManager } from './credential/credential.manager';
import { AuthUser, TokenResponse } from './interface';
import { JwtAuthService } from './jwt-auth.service';

@Service()
export class AuthService {
  constructor(
    @Inject()
    private readonly jwtAuthService: JwtAuthService,
    @Inject()
    private readonly credentialManager: CredentialManager,
    @Inject()
    private readonly studentRepository: StudentRepository,
    @Inject()
    private readonly errorMapper: ErrorMapper
  ) {}

  public async register(student: Student) {
    let existingUser: Student | null;

    if (!student.email) {
      existingUser = null;
    } else {
      existingUser = await this.studentRepository.findOne({
        where: { email: student.email! },
      });
    }

    if (existingUser) {
      throw new Error('Student already registered');
    }
    const hashPassword = await this.credentialManager.hashPassword(
      student.getPassword()
    );
    student.setPassword(hashPassword);

    await this.studentRepository.save(student);

    const { accessToken, refreshToken } =
      await this.jwtAuthService.tokenGenerator(student);

    return { accessToken, refreshToken };
  }

  public async login({
    email,
    password,
  }: LoginInput): Promise<Partial<TokenResponse>> {
    try {
      const user = await this.credentialManager.verifyCredentials(
        email,
        password
      );

      if (user) {
        const { accessToken, refreshToken } =
          await this.jwtAuthService.tokenGenerator(user);
        await this.credentialManager.hashRefreshToken(refreshToken, user);

        return { accessToken, refreshToken };
      } else {
        return this.errorMapper.throw('Invalid email or password');
      }
    } catch ({ message }) {
      Logger.error(message);
      return this.errorMapper.throw(message);
    }
  }

  public async logout(authUser: AuthUser) {
    try {
      const user = await this.studentRepository.findOneOrFail({
        where: { id: authUser.id },
      });

      if (!user) {
        return this.errorMapper.throw('User not found');
      }

      user.setRefreshToken(null);
      await this.studentRepository.save(user);
      return true;
    } catch ({ message }) {
      Logger.error(message);
      return this.errorMapper.throw(message);
    }
  }
}
