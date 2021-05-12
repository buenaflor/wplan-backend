import { WorkoutPlanRoleEnum } from '../../../workout-plan-role/workout-plan-role.enum';
import { WorkoutPlanPermissionEnum } from '../../../workout-plan-permission/workout-plan-permission.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class InviteCollaboratorRequestDto {
  @IsNotEmpty()
  @IsEnum(WorkoutPlanPermissionEnum)
  readonly permission: WorkoutPlanPermissionEnum;

  @IsNotEmpty()
  @IsEnum(WorkoutPlanRoleEnum)
  readonly role: WorkoutPlanRoleEnum;
}
