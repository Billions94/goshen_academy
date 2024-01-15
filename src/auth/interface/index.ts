import { Student } from '../../e-learning/students/entity/student';

export interface JwtPayload {
  id: string;
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
