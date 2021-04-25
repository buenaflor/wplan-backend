import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from '../user-profile/dto/user-profile.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * User Profile GET endpoint that should be accessible without access token
   *
   * @param req
   */
  @Get('/profiles/:username')
  async findUserProfileByUsername(@Request() req) {
    const { username } = req.params;
    const user = await this.userService.findOneByUsername(username);
    return UserProfileDto.createFromUser(user);
  }
}
