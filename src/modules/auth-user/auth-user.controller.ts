import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserMapper } from '../user/mapper/user.mapper';
import { UpdateUserDto } from '../user/dto/update-user.dto';

/**
 * This controller is responsible for handling authenticated user requests
 *
 */
@Controller('user')
export class AuthUserController {
  constructor(
    private userService: UserService,
    private userMapper: UserMapper,
  ) {}

  /**
   * Returns publicly and privately available information of the authenticated user
   * Accessing this endpoint needs an access token
   *
   * @param req
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(@Request() req) {
    try {
      const user = await this.userService.findOneById(req.user.userId);
      return this.userMapper.entityToPrivateUserDto(user);
    } catch (e) {
      throw e;
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateAuthenticatedUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      await this.userService.update(updateUserDto, req.user.userId);
      // TODO: if changing email, verified changes to false
    } catch (e) {
      throw e;
    }
  }
}
