import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EmailVerificationService } from '../shared/mail/verification/email-verification.service';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(private emailVerificationService: EmailVerificationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { token } = req.params;
    const emailVerification = await this.emailVerificationService.findByToken(
      token,
    );
    if (!emailVerification) {
      this.throwErr('Email confirmation link does not exist');
    }
    req.emailVerification = emailVerification;
    return true;
  }

  throwErr(message: string) {
    throw new HttpException(message, HttpStatus.NOT_FOUND);
  }
}
