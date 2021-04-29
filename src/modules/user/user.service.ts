import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrivateUserDto } from './dto/private-user.dto';
import { PublicUserDto } from './dto/public-user-dto';
import { UserDto } from './dto/user.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { raw } from "express";
import { camelCase } from "typeorm/util/StringUtils";
import { CreateUserDto } from "./dto/create-user.dto";

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
  async findAllUsers(
    options: IPaginationOptions,
  ): Promise<Pagination<PublicUserDto>> {
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
   * Finds a user and returns the publicly and privately available info of that user
   *
   * @param id
   */
  async findOnePrivateUserById(id: string): Promise<PrivateUserDto> {
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
  async findOnePublicUserByUsername(username: string): Promise<PublicUserDto> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user.createPublicUserDto();
  }

  /**
   * Finds a user and returns the publicly and privately available info of that user
   *
   * @param username
   */
  async findOnePrivateUserByUsername(username: string): Promise<PublicUserDto> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user.createPrivateUserDto();
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  /**
   * Finds a user and returns the internal representation
   * Don't expose the internal DTO to the controller
   *
   * @param username
   */
  async findOneInternalUserByUsername(username: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user.createInternalUserDto();
  }

  //================================================================================
  // Update resources
  //================================================================================

  async update(updateUserDto: UpdateUserDto, id: bigint) {
    const queryRes = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where({ id })
      .returning('*')
      .execute();
    if (queryRes.raw.isEmpty) {
      throw new NotFoundException('Could not update user');
    }
    if (queryRes.raw.length > 1) {
      throw new InternalServerErrorException();
    }
    // TODO: map queryRes.raw snake case?
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
      .where({ id: id })
      .execute();
  }

  updateEmailConfirmed(id: bigint, value: boolean) {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isEmailConfirmed: value })
      .where({ id })
      .execute();
  }

  // CREATE REQUESTS

  save(user: CreateUserDto) {
    return this.userRepository.save(user);
  }
}
