import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMapper } from './mapper/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserMapper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
