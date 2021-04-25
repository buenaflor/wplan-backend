import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ id }],
      relations: ['userProfile'],
    });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username }],
      relations: ['userProfile'],
    });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: [{ email }],
      relations: ['userProfile'],
    });
  }

  updateLoginDate(id) {
    const dateToday = new Date(
      Date.now() + 1000 * 60 * -new Date().getTimezoneOffset(),
    )
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    return this.userRepository
      .createQueryBuilder()
      .update()
      .set({ lastLoginAt: dateToday })
      .where('id=:id', { id: id })
      .execute();
  }

  updateEmailConfirmed(id: bigint, value: boolean) {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isEmailConfirmed: value })
      .where('id = :id', { id })
      .execute();
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
