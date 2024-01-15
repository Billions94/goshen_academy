import * as process from 'process';
import jwtService from 'jsonwebtoken';
import bcryptService from 'bcrypt';
import { Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import {
  JwtPayload,
  RefreshTokenResponse,
  TokenResponse,
  VerifyRefreshTokenResponse,
} from './interface';
import { StudentRepository } from '../e-learning/students/repository/studentRepository';
import { Student } from '../e-learning/students/entity/student';

@Service()
export class JwtAuthService {
  constructor(@Inject private readonly studentRepository: StudentRepository) {}

  async tokenGenerator(student: Student): Promise<TokenResponse> {
    const accessToken = await this.generateAccessToken({
      id: String(student.id),
    });
    const refreshToken = await this.generateRefreshToken({
      id: String(student.id),
    });

    const hashedRefresh = await bcryptService.hash(
      refreshToken,
      parseInt(<string>process.env.SALT_FACTOR)
    );

    await this.studentRepository
      .createQueryBuilder('user')
      .update(student)
      .set({ refreshToken: hashedRefresh })
      .execute();

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: JwtPayload) {
    return new Promise<string>((resolve, reject) => {
      jwtService.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY!,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
          algorithm: 'HS512',
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(<string>token);
        }
      );
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return new Promise<string>((resolve, reject) => {
      jwtService.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET_KEY!,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
          algorithm: 'HS512',
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(<string>token);
        }
      );
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
      jwtService.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY!,
        (err, decodedToken) => {
          if (err) reject(err);
          else resolve(<JwtPayload>decodedToken);
        }
      );
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwtService.verify(
        token,
        process.env.JWT_REFRESH_TOKEN_SECRET_KEY!,
        (err, decodedToken) => {
          if (err) reject(err);
          else resolve(<JwtPayload>decodedToken);
        }
      );
    });
  }

  async verifyJwtAccessToken(
    token: string
  ): Promise<VerifyRefreshTokenResponse> {
    try {
      const decodedToken = await this.verifyAccessToken(token);
      return {
        valid: true,
        expired: false,
        decodedToken,
      };
    } catch (error: any) {
      return {
        valid: false,
        expired: error.message === 'jwt expired',
        decodedToken: null,
      };
    }
  }

  async refreshTokens(
    currentRefreshToken: string
  ): Promise<Partial<RefreshTokenResponse>> {
    try {
      const decodedToken = await this.verifyRefreshToken(currentRefreshToken);
      const student = await this.studentRepository.findById(
        parseInt(decodedToken.id)
      );

      if (
        await bcryptService.compare(
          currentRefreshToken,
          String(student.getRefreshToken())
        )
      ) {
        const { accessToken, refreshToken } = await this.tokenGenerator(
          student
        );
        return { accessToken, refreshToken, user: student };
      } else {
        return { errorMessage: 'Refresh token is invalid' };
      }
    } catch (err) {
      return { errorMessage: err.message };
    }
  }

  async revokeAccessToken(currentRefreshToken: string): Promise<boolean> {
    const decodedToken = await this.verifyRefreshToken(currentRefreshToken);
    const student = await this.studentRepository.findById(
      parseInt(decodedToken.id)
    );

    if (!student) throw new Error('User not found');

    student.refreshToken = null;
    await this.studentRepository.save(student);
    return true;
  }
}
