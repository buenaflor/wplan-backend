import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';
import { PublicUserDto } from '../dto/public-user-dto';

/**
 * UserMapper maps the user dto to the appropriate entity.
 *
 */
export class UserMapper {
  dtoToEntity(createUserDto: CreateUserDto) {
    return new User(
      null,
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );
  }
}
