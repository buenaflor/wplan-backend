import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { PrivateUserDto } from './dto/response/private-user.dto';
import { PublicUserDto } from './dto/response/public-user-dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './dto/request/create-user.dto';
import { AuthUserDto } from '../auth-user/dto/auth-user.dto';

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
        return elem.toPublicUserDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds a user and returns the publicly and privately available info of that user
   *
   * @param authUser
   */
  async findOnePrivateUser(authUser: AuthUserDto): Promise<PrivateUserDto> {
    const user = await this.userRepository.findOne(authUser.userId);
    if (!user) {
      throw new NotFoundException(
        'Could not find a user with id: ' + authUser.userId,
      );
    }
    return user.toPrivateUserDto();
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
    return user.toPublicUserDto();
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
   * @param authUser
   */
  async update(updateUserDto: UpdateUserDto, authUser: AuthUserDto) {
    const queryRes = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where({ id: authUser.userId })
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
    // ToDo: use a subscriber to update the login date
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
    const userToSave = await this.userRepository.create(user);
    const userFromDb = await this.userRepository.save(userToSave);
    return userFromDb.toPrivateUserDto();
  }
}
