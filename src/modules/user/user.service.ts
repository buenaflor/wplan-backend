import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrivateUserDto } from './dto/private-user.dto';
import { PublicUserDto } from './dto/public-user-dto';
import { UserDto } from './dto/user.dto';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //================================================================================
  // Get resources
  //================================================================================

  /**
   * Returns all public users paginated
   *
   * @param options
   */
  async findAllPublicUsers(options: IPaginationOptions) {
    const res = await paginate<User>(this.userRepository, options);
    return new Pagination(
      res.items.map((elem) => {
        return elem.createPublicUserDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds a user and returns the internal representation
   * Don't expose the internal DTO to the controller
   *
   * @param username
   */
  async findInternalUserByUsername(username: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user.createInternalUserDto();
  }

  /**
   * Finds a user and returns the publicly and privately available info of that user
   *
   * @param id
   */
  async findPrivateUserById(id: string): Promise<PrivateUserDto> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Could not find a user with id: ' + id);
    }
    return user.createPrivateUserDto();
  }

  /**
   * Finds a user and returns the publicly and privately available info of that user
   *
   * @param username
   */
  async findPublicUserByUsername(username: string): Promise<PublicUserDto> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user.createPublicUserDto();
  }

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  //================================================================================
  // Update resources
  //================================================================================

  async update(updateUserDto: UpdateUserDto, id: bigint) {
    const user = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where({ id })
      .execute();
    if (!user) {
      throw new NotFoundException('Could not find a user with id: ' + id);
    }
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
