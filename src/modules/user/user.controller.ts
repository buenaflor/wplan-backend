import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserMapper } from './mapper/user.mapper';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }
}
