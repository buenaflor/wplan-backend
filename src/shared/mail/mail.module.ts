import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { mailConfig } from './mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailConfig,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
