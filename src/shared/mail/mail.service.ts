import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../modules/user/user.entity';
import { EmailVerification } from './verification/email-verification.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, emailVerification: EmailVerification) {
    const url = `http://localhost:4000/api/v1/auth/mail/confirmation/${emailVerification.token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@wplan.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'confirmation', // `.hbs` extension is appended automatically
      text: 'Welcome' + user + ' click:     ' + url,
    });
  }
}
