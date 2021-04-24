import { CreateUserDto } from '../../../shared/auth/dto/create-user.dto';
import { User } from '../user.entity';

/**
 * UserMapper maps the user dto to the appropriate entity.
 *
 */
export class UserMapper {
  async dtoToEntity(createUserDto: CreateUserDto): Promise<User> {
    return new User(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
      new Date(),
    );
  }
}
