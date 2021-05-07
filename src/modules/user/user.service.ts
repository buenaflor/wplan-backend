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
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './dto/create-user.dto';

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
    const user = await this.userRepository.findOne({ login: username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user.createPublicUserDto();
  }

  async loginNameExists(login: string) {
    const user = await this.userRepository.findOne({ login });
    return !!user;
  }

  async emailExists(email: string) {
    const user = await this.userRepository.findOne({ email });
    return !!user;
  }

  /**
   * Finds a user and returns the internal representation
   * Don't expose the internal DTO to the controller
   *
   * @param username
   */
  async findOneInternalUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ login: username });
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with username: ' + username,
      );
    }
    return user;
  }

  //================================================================================
  // Update resources
  //================================================================================

  /**
   * Updates the user information
   *
   * @param updateUserDto
   * @param userId
   */
  async update(updateUserDto: UpdateUserDto, userId: string) {
    const queryRes = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where({ id: userId })
      .returning('*')
      .execute();
    // ToDo: raw query will not parse snake case
    if (queryRes.raw.isEmpty) {
      throw new NotFoundException('Could not update user');
    }
    if (queryRes.raw.length > 1) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Updates the login date to the current timestamp
   *
   * @param userId
   */
  updateLoginDate(userId: string) {
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
      .where({ id: userId })
      .execute();
  }

  updateEmailConfirmed(userId: string, value: boolean) {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isEmailConfirmed: value })
      .where({ id: userId })
      .execute();
  }

  // CREATE REQUESTS

  async save(user: CreateUserDto) {
    const userFromDb = await this.userRepository.save(user);
    return userFromDb.createPrivateUserDto();
  }
}
