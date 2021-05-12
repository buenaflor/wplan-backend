import { WorkoutPlanRoleDto } from '../../../workout-plan-role/dto/workout-plan-role.dto';
import { PublicUserDto } from '../../../../user/dto/response/public-user-dto';
import { WorkoutPlanPermissionDto } from '../../../workout-plan-permission/dto/workout-plan-permission.dto';
import { IsNotEmpty } from 'class-validator';
import { PublicWorkoutPlanDto } from '../../../workout-plan/dto/response/public-workout-plan.dto';

export class WorkoutPlanCollaboratorInvitationDto {
  constructor(
    id: string,
    workoutPlan: PublicWorkoutPlanDto,
    invitee: PublicUserDto,
    inviter: PublicUserDto,
    role: WorkoutPlanRoleDto,
    permission: WorkoutPlanPermissionDto,
  ) {
    this.id = id;
    this.workoutPlan = workoutPlan;
    this.invitee = invitee;
    this.inviter = inviter;
    this.role = role;
    this.permission = permission;
  }

  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly workoutPlan: PublicWorkoutPlanDto;

  @IsNotEmpty()
  readonly invitee: PublicUserDto;

  @IsNotEmpty()
  readonly inviter: PublicUserDto;

  @IsNotEmpty()
  readonly role: WorkoutPlanRoleDto;

  @IsNotEmpty()
  readonly permission: WorkoutPlanPermissionDto;
}
