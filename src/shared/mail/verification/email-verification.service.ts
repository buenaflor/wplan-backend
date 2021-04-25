import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from './email-verification.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
  ) {}

  save(emailVerification: EmailVerification) {
    return this.emailVerificationRepository.save(emailVerification);
  }

  findByToken(token: string) {
    return this.emailVerificationRepository.findOne({
      where: [
        {
          token,
        },
      ],
    });
  }

  async deleteByUserId(id: bigint) {
    await this.emailVerificationRepository.delete({
      userId: id,
    });
  }

  async deleteByToken(token: string) {
    await this.emailVerificationRepository.delete({
      token,
    });
  }

  async verifyThenDelete(emailVerification: EmailVerification) {
    if (!emailVerification) {
      return false;
    }
    const dateNow = Math.floor(Date.now() / 1000);
    const dateToCompare = emailVerification.createdAt.getTime() / 1000;
    const verified = dateNow - dateToCompare < emailVerification.expirationTime;
    // The email verification will be deleted regardless if it has expired or not
    await this.deleteByToken(emailVerification.token);
    return verified;
  }
}
