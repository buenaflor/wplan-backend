import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';

@Injectable()
export class UserRegistrationGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const checkUser: CreateUserDto = context.switchToHttp().getRequest().body;
    const userWithUsername = await this.userService.findOneByUsername(
      checkUser.username,
    );
    const userWithEmail = await this.userService.findOneByEmail(
      checkUser.email,
    );
    if (userWithUsername) {
      this.throwErr('Duplicate: username already exists.');
    }
    if (userWithEmail) {
      this.throwErr('Duplicate: email already exists.');
    }
    return true;
  }

  throwErr(message: string) {
    throw new HttpException(message, HttpStatus.CONFLICT);
  }
}
