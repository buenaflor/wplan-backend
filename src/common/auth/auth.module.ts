import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../modules/user/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from './auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { EmailVerificationModule } from '../mail/verification/email-verification.module';

@Module({
  imports: [
    MailModule,
    UserModule,
    PassportModule,
    EmailVerificationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
