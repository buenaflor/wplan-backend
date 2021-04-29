import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';
import { PrivateUserDto } from '../dto/private-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * UserMapper maps the user dto to the appropriate entity.
 *
 */
export class UserMapper {
  updateUserDtoToEntity(updateUserDto: UpdateUserDto) {
    return new User(null, null, updateUserDto.email, null);
  }
}
