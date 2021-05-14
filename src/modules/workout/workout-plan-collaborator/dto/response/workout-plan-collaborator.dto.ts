import { IsNotEmpty } from 'class-validator';
import { PublicUserDto } from '../../../../user/dto/response/public-user-dto';
import { WorkoutPlanPermissionDto } from '../../../workout-plan-permission/dto/workout-plan-permission.dto';
import { WorkoutPlanRoleDto } from '../../../workout-plan-role/dto/workout-plan-role.dto';

export class WorkoutPlanCollaboratorDto {
  constructor(
    id: string,
    role: WorkoutPlanRoleDto,
    user: PublicUserDto,
    permission: WorkoutPlanPermissionDto,
  ) {
    this.id = id;
    this.user = user;
    this.role = role;
    this.permission = permission;
  }

  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly user: PublicUserDto;

  @IsNotEmpty()
  readonly role: WorkoutPlanRoleDto;

  @IsNotEmpty()
  readonly permission: WorkoutPlanPermissionDto;
}
