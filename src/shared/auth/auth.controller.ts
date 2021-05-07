import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Put,
  Patch,
  Param, ForbiddenException
} from "@nestjs/common";
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
import { BaseResponseDto } from '../base-response/base-response.dto';

//TODO: limit exposure? -> client secret maybe
@Controller(Routes.auth.controller)
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private userService: UserService,
  ) {}

  /**
   * Logs in the user and returns a valid JWT
   *
   * @param authUser
   */
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

  /**
   * Verifies the email and deletes the email verification from the table
   *
   * @param req
   */
  @Patch(Routes.auth.get.emailConfirmationToken)
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
      return new BaseResponseDto('Success, your account has been verified');
    }
    return new BaseResponseDto('Token expired. Resend the email verification');
  }

  /**
   * Resends the email verification link to the specified email
   *
   * @param authUser
   */
  @UseGuards(JwtAuthGuard)
  @Put(Routes.auth.post.resendEmail)
  async resendMail(@AuthUser() authUser) {
    const userId = authUser.userId;
    const user = await this.userService.findOnePrivateUserById(userId);
    if (user.isEmailConfirmed) {
      throw new ForbiddenException('Email is already verified');
    }
    await this.emailVerificationService.deleteByUserId(userId);
    const emailVerification = await this.authService.createEmailVerification(
      userId,
    );
    await this.authService.sendMail(user.email, emailVerification);
    return new BaseResponseDto('Resending email was successful');
  }
}
