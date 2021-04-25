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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private userMapper: UserMapper,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const accessToken = this.authService.createJWT(req.user);
    await this.authService.login(req.user);
    return new LoginPayloadDto(req.user, accessToken);
  }

  @Post('/register')
  @UseGuards(UserRegistrationGuard)
  async register(@Body() createUserDto: CreateUserDto) {
    const emailVerification = await this.authService.createEmailVerification();
    const user = await this.userMapper.dtoToEntity(createUserDto);
    console.log(user);
    await this.authService.sendMail(user, emailVerification);
    return 'succ';
  }

  @Get('/mail/confirmation/:token')
  async confirmMail(@Request() req) {
    const { token } = req.params;
    const verified = await this.emailVerificationService.verifyThenDelete(
      token,
    );
    if (verified) {
      return 'verified';
    }
    return 'token expired';
  }
}
