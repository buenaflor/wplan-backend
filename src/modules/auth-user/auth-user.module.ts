import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { UserModule } from '../user/user.module';
import { UserMapper } from '../user/mapper/user.mapper';

@Module({
  imports: [UserModule],
  providers: [UserMapper],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
