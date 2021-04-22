import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const checkUser = context.switchToHttp().getRequest().body;
    const userInDb = await this.userRepository.findOne({
      username: checkUser.username,
    });
    if (userInDb != null) {
      throw new HttpException(
        'Duplicate: username already exists.',
        HttpStatus.CONFLICT,
      );
    }
    return true;
  }
}
