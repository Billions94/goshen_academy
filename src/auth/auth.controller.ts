import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  JsonController,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { ErrorResponse, LoginInput } from '../e-learning/interfaces';
import { Student } from '../e-learning/students/entity/student.entity';
import { AuthService } from './auth.service';
import { AuthUser, TokenResponse } from './interface';

@Service()
@JsonController('/auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('/register')
  public async registerStudent(
    @Body() studentInput: Student
  ): Promise<Partial<TokenResponse>> {
    return this.authService.register(studentInput);
  }

  @Post('/login')
  public async loginStudent(
    @Body() loginInput: LoginInput
  ): Promise<Partial<TokenResponse>> {
    return this.authService.login(loginInput);
  }

  @Authorized()
  @Delete('/logout')
  public async logout(
    @CurrentUser() authUser: AuthUser
  ): Promise<true | ErrorResponse> {
    return this.authService.logout(authUser);
  }
}
