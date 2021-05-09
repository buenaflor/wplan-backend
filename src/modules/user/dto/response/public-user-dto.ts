import { Exclude, Expose } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { PrivateUserDto } from './private-user.dto';

/**
 * DTO that encapsulates user data that is publicly available
 *
 */
@Exclude()
export class PublicUserDto extends OmitType(PrivateUserDto, [
  'isEmailConfirmed',
  'publicWorkoutPlans',
  'privateWorkoutPlans',
] as const) {
  @Expose()
  readonly login: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly bio: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  readonly lastLoginAt: Date;
}
