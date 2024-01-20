import { get } from 'lodash';
import { RequestHandler } from 'express';
import { Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import { JwtAuthService } from '../auth/jwtService';
import { Student as ExpressUser } from '../e-learning/students/entity/student';
import { StudentRepository } from '../e-learning/students/repository/studentRepository';
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
export class AuthGuard {
  @Inject
  private readonly jwtAuthService: JwtAuthService;
  @Inject
  private readonly studentRepository: StudentRepository;

  init: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
      if (
        req.method === 'GET' ||
        req.path.includes('register') ||
        req.path.includes('login')
      ) {
        return next();
      } else {
        res.send({
          error: {
            message: 'Please provide token in Authorization header!',
          },
        });
      }
    } else {
      const accessToken = req?.headers?.authorization?.replace('Bearer ', '');
      const refreshToken = String(get(req, 'headers.x-refresh'));

      const { decodedToken, expired } =
        await this.jwtAuthService.verifyJwtAccessToken(accessToken);

      if (decodedToken) {
        const user = await this.studentRepository.findById(
          parseInt(String(decodedToken?.id))
        );

        if (user) {
          req.user = user;
          return next();
        }
      } else if (expired && refreshToken) {
        const { accessToken, user, errorMessage } =
          await this.jwtAuthService.refreshTokens(refreshToken);

        if (errorMessage) {
          Logger.warn('Jwt token expired');
          return next();
        }
        if (accessToken) {
          res.setHeader('x-access-token', accessToken);
        }

        req.user = user;
        return next();
      }
    }
  };
}
