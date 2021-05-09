import { ConfigService } from '../../config/config.service';
import { MailerOptions } from '@nestjs-modules/mailer';

export const mailConfig = (configService: ConfigService) => {
  return {
    transport: {
      host: configService.get('EMAIL_HOST'),
      secure: true,
      port: configService.get('EMAIL_PORT'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASS'),
      },
    },
  } as MailerOptions;
};
