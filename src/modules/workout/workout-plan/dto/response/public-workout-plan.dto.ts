import { PublicUserDto } from '../../../../user/dto/response/public-user-dto';
import { AbstractDto } from '../../../../../utils/abstract/abstract.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PublicWorkoutPlanDto extends AbstractDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  isCompleted: boolean;

  @Expose()
  isPrivate: boolean;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  @Type(() => PublicUserDto)
  owner: PublicUserDto;
}
