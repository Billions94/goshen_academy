import { Student } from '../../e-learning/students/entity/student.entity';
import { Privilege } from '../../e-learning/students/interface';

export interface JwtPayload {
  id: string;
  privileges: Privilege[];
  session?: string;
}

export interface VerifyRefreshTokenResponse {
  valid: boolean;
  expired: boolean;
  decodedToken: JwtPayload | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  error?: {
    message: string;
  };
}

export interface RefreshTokenResponse {
  errorMessage?: string;
  accessToken: string;
  refreshToken: string;
  user: Student;
}

export interface AuthUser
  extends Pick<Student, 'id' | 'isAdmin' | 'courses' | 'privileges'> {}
