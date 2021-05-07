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

  /**
   * Saves an email verification
   *
   * @param emailVerification
   */
  save(emailVerification: EmailVerification) {
    return this.emailVerificationRepository.save(emailVerification);
  }

  /**
   * Finds an email verification by token
   *
   * @param token
   */
  findByToken(token: string) {
    return this.emailVerificationRepository.findOne({
      where: [
        {
          token,
        },
      ],
    });
  }

  /**
   * Deletes an email verification by user id
   *
   * @param userId
   */
  async deleteByUserId(userId: string) {
    await this.emailVerificationRepository.delete({
      userId,
    });
  }

  /**
   * Deletes an email verification by token
   *
   * @param token
   */
  async deleteByToken(token: string) {
    await this.emailVerificationRepository.delete({
      token,
    });
  }

  /***
   * Check if the email can be verified and then delete the verification.
   * The email verification will be deleted every time because it does not matter
   * if the email can be verified or has been expired.
   *
   * @param emailVerification
   */
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
