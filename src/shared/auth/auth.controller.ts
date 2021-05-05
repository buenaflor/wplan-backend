import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Put,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserRegistrationGuard } from '../../guards/user-registration.guard';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { EmailVerificationService } from '../mail/verification/email-verification.service';
import { UserService } from '../../modules/user/user.service';
import { EmailConfirmationGuard } from '../../guards/email-confirmation.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Routes } from '../../config/constants';
import { AuthUser } from '../../modules/auth-user/decorator/auth-user.decorator';

//TODO: limit exposure? -> client secret maybe
@Controller(Routes.auth.controller)
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private userService: UserService,
  ) {}

  @Post(Routes.auth.post.login)
  @UseGuards(LocalAuthGuard)
  async login(@AuthUser() authUser) {
    const accessToken = this.authService.createJWT(authUser);
    await this.authService.updateLoginDate(authUser.id);
    return new LoginPayloadDto(authUser, accessToken);
  }
  // TODO: sign out -> revoke access token; refresh token
  /**
   * Post endpoint responsible for creating a user and sending an email verification
   * Creating a user also creates a user profile
   *
   * @param createUserDto
   */
  @Post(Routes.auth.post.register)
  @UseGuards(UserRegistrationGuard)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.save(createUserDto);
    const emailVerification = await this.authService.createEmailVerification(
      user.id,
    );
    await this.authService.sendMail(user.email, emailVerification);
    return user;
  }

  @Post(Routes.auth.get.emailConfirmationToken)
  @UseGuards(EmailConfirmationGuard)
  async confirmMail(@Request() req) {
    const emailVerification = req.emailVerification;
    const verified = await this.emailVerificationService.verifyThenDelete(
      emailVerification,
    );
    // The email verification will be deleted regardless if it has expired or not
    await this.emailVerificationService.deleteByToken(emailVerification.token);
    if (verified) {
      const userId = emailVerification.userId;
      await this.userService.updateEmailConfirmed(userId, true);
      return {
        message: 'Success, your account has been verified',
      };
    }
    return {
      message: 'Token expired. Resend the email verification',
    };
    // TODO: return an email verification DTO
  }

  @UseGuards(JwtAuthGuard)
  @Put(Routes.auth.post.resendEmail)
  async resendMail(@Request() req) {
    const userId = req.user.userId;
    const resendEmailUserDto = req.body;
    await this.emailVerificationService.deleteByUserId(userId);
    const emailVerification = await this.authService.createEmailVerification(
      resendEmailUserDto.id,
    );
    await this.authService.sendMail(
      resendEmailUserDto.email,
      emailVerification,
    );
    return 'email resend succ';
    // TODO: only resend a limited number of times -> danger of DOS attacks
    // TODO: prevent resend, if the email is already confirmed, maybe with guard
  }
}
