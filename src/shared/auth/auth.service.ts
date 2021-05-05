import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { User } from '../../modules/user/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '../../config/config.service';
import * as crypto from 'crypto';
import { EmailVerificationService } from '../mail/verification/email-verification.service';
import { EmailVerification } from '../mail/verification/email-verification.entity';
import { PrivateUserDto } from '../../modules/user/dto/private-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private emailVerificationService: EmailVerificationService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<PrivateUserDto> {
    const user = await this.userService.findOneInternalUserByUsername(username);
    if (user && (await argon2.verify(user.password, pass))) {
      return new PrivateUserDto(
        user.id,
        user.username,
        user.email,
        user.createdAt,
        user.lastLoginAt,
        user.isEmailConfirmed,
      );
    }
    return null;
  }

  async updateLoginDate(userId: bigint) {
    await this.userService.updateLoginDate(userId);
  }

  async createEmailVerification(userId: string) {
    const buffer = crypto.randomBytes(64);
    const verificationToken = buffer.toString('hex');
    const emailVerification = new EmailVerification(verificationToken, userId);
    return await this.emailVerificationService.save(emailVerification);
  }

  async sendMail(email: string, emailVerification: EmailVerification) {
    await this.mailService.sendUserConfirmation(email, emailVerification);
  }

  createJWT(user: User) {
    const payload = { username: user.login, id: user.id };
    return {
      expiresIn: this.configService.getNumber('JWT_EXPIRATION_DURATION'),
      accessToken: this.jwtService.sign(payload),
    };
  }
}
