import { Controller, Post, UseGuards, Request, Body, Get } from "@nestjs/common";
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserRegistrationGuard } from '../../guards/user-registration.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const accessToken = this.authService.createToken(req.user);
    await this.authService.login(req.user);
    return new LoginPayloadDto(req.user, accessToken);
  }

  @Post('/register')
  @UseGuards(UserRegistrationGuard)
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.sendMail(
      createUserDto.username,
      createUserDto.email,
    );
    return 'succ';
  }

  @Get('/mail/confirmation')
  async confirmMail(@Request() req) {

  }
}
