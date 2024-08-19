import bcryptService from 'bcrypt';
import jwtService from 'jsonwebtoken';
import * as process from 'process';
import { Inject, Service } from 'typedi';
import { Student } from '../e-learning/students/entity/student';
import { StudentRepository } from '../e-learning/students/repository/studentRepository';
import {
  JwtPayload,
  RefreshTokenResponse,
  TokenResponse,
  VerifyRefreshTokenResponse,
} from './interface';

@Service()
export class JwtAuthService {
  constructor(
    @Inject() private readonly studentRepository: StudentRepository
  ) {}

  public async tokenGenerator(student: Student): Promise<TokenResponse> {
    const accessToken = await this.generateAccessToken({
      id: String(student.id),
    });
    const refreshToken = await this.generateRefreshToken({
      id: String(student.id),
    });

    return { accessToken, refreshToken };
  }

  public async generateAccessToken(payload: JwtPayload): Promise<string> {
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

  public async generateRefreshToken(payload: JwtPayload): Promise<string> {
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

  public async verifyAccessToken(token: string): Promise<JwtPayload> {
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

  public async verifyRefreshToken(token: string): Promise<JwtPayload> {
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

  public async verifyJwtAccessToken(
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

  public async refreshTokens(
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
    } catch ({ message }) {
      return { errorMessage: message };
    }
  }

  public async revokeAccessToken(
    currentRefreshToken: string
  ): Promise<boolean> {
    const decodedToken = await this.verifyRefreshToken(currentRefreshToken);
    const student = await this.studentRepository.findById(
      parseInt(decodedToken.id)
    );

    if (!student) throw new Error('User not found');

    student.setRefreshToken(null);
    await this.studentRepository.save(student);
    return true;
  }
}
