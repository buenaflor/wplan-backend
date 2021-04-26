import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';

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
