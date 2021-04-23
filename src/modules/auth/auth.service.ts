import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../shared/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (user && (await argon2.verify(user.password, pass))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    await this.userService.updateLoginDate(user.id);
  }

  async sendMail(user: string, email: string) {
    await this.mailService.sendUserConfirmation(user, email, 'token');
  }

  createToken(user: User) {
    const payload = { username: user.username, id: user.id };
    return {
      expiresIn: 60,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
