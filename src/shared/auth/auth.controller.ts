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
import { ResendEmailUserDto } from '../../modules/user/dto/resend-email-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private userService: UserService,
    private userMapper: UserMapper,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const accessToken = this.authService.createJWT(req.user);
    await this.authService.updateLoginDate(req.user.id);
    return new LoginPayloadDto(req.user, accessToken);
  }

  @Post('/register')
  @UseGuards(UserRegistrationGuard)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userMapper.dtoToEntity(createUserDto);
    await this.userService.save(user);
    const emailVerification = await this.authService.createEmailVerification(
      user.id,
    );
    await this.authService.sendMail(user.email, emailVerification);
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
  async resendMail(@Body() resendEmailUserDto: ResendEmailUserDto) {
    await this.emailVerificationService.deleteByUserId(resendEmailUserDto.id);
    const emailVerification = await this.authService.createEmailVerification(
      resendEmailUserDto.id,
    );
    await this.authService.sendMail(
      resendEmailUserDto.email,
      emailVerification,
    );
    return 'email resend succ';
    // TODO: only resend a limited number of times -> danger of DOS attacks
  }
}
