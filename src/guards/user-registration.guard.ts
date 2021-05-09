import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { CreateUserDto } from '../modules/user/dto/request/create-user.dto';

@Injectable()
export class UserRegistrationGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const checkUser: CreateUserDto = context.switchToHttp().getRequest().body;
    const loginNameExists = await this.userService.loginNameExists(
      checkUser.login,
    );
    const emailExists = await this.userService.emailExists(checkUser.email);
    console.log(loginNameExists);
    if (loginNameExists) {
      this.throwErr('Duplicate: username already exists.');
    }
    if (emailExists) {
      this.throwErr('Duplicate: email already exists.');
    }
    return true;
  }

  throwErr(message: string) {
    throw new HttpException(message, HttpStatus.CONFLICT);
  }
}
