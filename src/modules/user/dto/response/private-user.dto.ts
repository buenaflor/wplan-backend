import { Exclude } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';

/**
 * DTO that encapsulates user data that is privately available
 *
 */
@Exclude()
export class PrivateUserDto extends OmitType(UserDto, ['password'] as const) {}
