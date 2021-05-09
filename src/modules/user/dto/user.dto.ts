import { AbstractDto } from '../../../utils/abstract/abstract.dto';
import { Exclude, Expose } from 'class-transformer';

/**
 * Internal representation of a user. This DTO should not be exposed to the public
 *
 */
@Exclude()
export class UserDto extends AbstractDto {
  @Expose()
  readonly login: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly bio: string;

  @Expose()
  readonly password: string;

  @Expose()
  readonly lastLoginAt: Date;

  @Expose()
  readonly isEmailConfirmed: boolean;

  @Expose()
  readonly publicWorkoutPlans: number;

  @Expose()
  readonly privateWorkoutPlans: number;
}
