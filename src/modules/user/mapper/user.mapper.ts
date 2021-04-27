import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';
import { PrivateUserDto } from '../dto/private-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * UserMapper maps the user dto to the appropriate entity.
 *
 */
export class UserMapper {
  createUserDtoToEntity(createUserDto: CreateUserDto) {
    return new User(
      null,
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );
  }

  updateUserDtoToEntity(updateUserDto: UpdateUserDto) {
    return new User(null, null, updateUserDto.email, null);
  }

  entityToPrivateUserDto(user: User) {
    return new PrivateUserDto(
      user.id,
      user.username,
      user.email,
      user.createdAt,
      user.lastLoginAt,
      user.isEmailConfirmed,
    );
  }
}
