import { TokenPayloadDto } from './token-payload.dto';
import { PrivateUserDto } from '../../../modules/user/dto/response/private-user.dto';

export class LoginPayloadDto {
  user: PrivateUserDto;

  token: TokenPayloadDto;

  constructor(user: PrivateUserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
