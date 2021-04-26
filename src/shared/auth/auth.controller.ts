import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserRegistrationGuard } from '../../guards/user-registration.guard';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UserMapper } from '../../modules/user/mapper/user.mapper';
import { EmailVerificationService } from '../mail/verification/email-verification.service';
import { UserService } from '../../modules/user/user.service';
import { EmailConfirmationGuard } from '../../guards/email-confirmation.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserProfile } from '../../modules/user-profile/user-profile.entity';
import { UserProfileService } from '../../modules/user-profile/user-profile.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private userService: UserService,
    private userProfileService: UserProfileService,
    private userMapper: UserMapper,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const accessToken = this.authService.createJWT(req.user);
    await this.authService.updateLoginDate(req.user.id);
    return new LoginPayloadDto(req.user, accessToken);
  }
  // TODO: sign out -> revoke access token

  /**
   * Post endpoint responsible for creating a user and sending an email verification
   * Creating a user also creates a user profile
   *
   * @param createUserDto
   */
  @Post('/register')
  @UseGuards(UserRegistrationGuard)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userMapper.dtoToEntity(createUserDto);
    const userProfile = await this.userProfileService.save(new UserProfile());
    user.userProfileId = userProfile.id;
    await this.userService.save(user);
    const emailVerification = await this.authService.createEmailVerification(
      user.id,
    );
    await this.authService.sendMail(user.email, emailVerification);
    // TODO: maybe expiration time for email confirmation?
    // TODO: return a user DTO
    return 'succ';
  }

  @Get('/mail/confirmation/:token')
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
      return 'verified';
    }
    return 'token expired';
    // TODO: return an email verification DTO
  }

  @UseGuards(JwtAuthGuard)
  @Post('/mail/confirmation/resend/')
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
