import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserExistGuard } from '../../guards/user.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Post()
  @UseGuards(UserExistGuard)
  async save(@Body() createUserDto: CreateUserDto): Promise<User> {
    const userEntity = await this.userMapper.dtoToEntity(createUserDto);
    return await this.userService.save(userEntity);
  }
}
