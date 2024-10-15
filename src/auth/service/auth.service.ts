import { Inject, Service } from 'typedi';
import { Cart } from '../../cart/entity/cart.entity';
import { CartJobService } from '../../cart/jobs/cart.jobs.service';
import { ErrorResponse, LoginInput } from '../../e-learning/interfaces';
import { Student } from '../../e-learning/students/entity/student.entity';
import { StudentRepository } from '../../e-learning/students/repository/student.repository';
import Logger from '../../utils/logger/logger';
import { ErrorMapper } from '../../utils/mapper/errorMapper';
import { CredentialManager } from '../credential/credential.manager';
import { AuthUser } from '../interface';
import { JwtAuthService } from '../jwt/service/jwt-auth.service';
import { TokenResponse } from './interface';

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
    private readonly cartJobService: CartJobService<Cart>,
    @Inject()
    private readonly errorMapper: ErrorMapper
  ) {}

  public async register(student: Student): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    let existingStudent: Student | null;

    if (!student.email) {
      existingStudent = null;
    } else {
      existingStudent = await this.studentRepository.findOne({
        where: { email: student.email! },
      });
    }

    if (existingStudent) {
      throw new Error('Student already registered');
    }

    const hashPassword = await this.credentialManager.hashPassword(
      student.getPassword()
    );
    const hashSecondaryPassword = await this.credentialManager.hashPassword(
      student.getSecondaryPassword()
    );

    student.setPassword(hashPassword);
    student.setSecondaryPassword(hashSecondaryPassword);
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
      const { student } = await this.credentialManager.verifyCredentials(
        email,
        password
      );

      if (student) {
        const { accessToken, refreshToken } =
          await this.jwtAuthService.tokenGenerator(student);
        await this.credentialManager.hashRefreshToken(refreshToken, student);

        await this.cartJobService.addJob({
          entity: {
            student: { id: student.id } as Student,
            product: null,
            productName: '',
            quantity: 0,
          },
        });

        return { accessToken, refreshToken };
      } else {
        return this.errorMapper.throw('Invalid email or password');
      }
    } catch ({ message }) {
      Logger.error(message);
      return this.errorMapper.throw(message);
    }
  }

  public async logout(authUser: AuthUser): Promise<true | ErrorResponse> {
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
