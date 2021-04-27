import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // GET REQUESTS

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ id }],
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }],
    });
    if (!user) {
      throw new NotFoundException('Resource cannot be found');
    }
    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: [{ email }],
    });
  }

  // UPDATE REQUESTS

  async update(user: UpdateUserDto, id: bigint) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(user)
      .where({ id })
      .execute();
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

  // CREATE REQUESTS

  save(user: User) {
    return this.userRepository.save(user);
  }
}
