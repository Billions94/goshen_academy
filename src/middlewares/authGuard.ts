import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { JwtAuthService } from '../auth/jwt/service/jwt-auth.service';
import { Student as ExpressUser } from '../e-learning/students/entity/student.entity';
import { StudentRepository } from '../e-learning/students/repository/student.repository';
import Logger from '../utils/logger/logger';

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      user?: ExpressUser;
    }
  }
}
@Service()
@Middleware({ type: 'before' })
export class AuthGuard implements ExpressMiddlewareInterface {
  @Inject()
  private readonly jwtAuthService: JwtAuthService;
  @Inject()
  private readonly studentRepository: StudentRepository;

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      if (
        req.method === 'GET' ||
        req.path.includes('register') ||
        req.path.includes('login')
      ) {
        return next();
      } else {
        return res.status(401).send({
          status: 401,
          error: { message: 'Please provide token in Authorization header!' },
        });
      }
    } else {
      const accessToken = req?.headers?.authorization?.replace('Bearer ', '');
      const refreshToken = String(req.headers['x-refresh']);
      const { decodedToken, expired } =
        await this.jwtAuthService.verifyJwtAccessToken(accessToken);

      if (decodedToken) {
        const user = await this.studentRepository.findById(decodedToken?.id);

        if (user) {
          req.user = user;
          return next();
        }
      } else if (expired && refreshToken) {
        const { accessToken, user, errorMessage } =
          await this.jwtAuthService.refreshTokens(refreshToken);

        if (errorMessage) {
          Logger.warn('JWT token expired and refresh token failed');

          return res.status(401).send({
            status: 401,
            error: { message: 'Session expired. Please log in again.' },
          });
        }

        req.headers['authorization'] = `Bearer ${accessToken}`;
        req.headers['x-refresh'] = refreshToken;
        req.user = user;

        return next();
      }
    }

    return res.status(401).send({
      status: 401,
      error: { message: 'Invalid or expired token. Please log in again.' },
    });
  }
}
