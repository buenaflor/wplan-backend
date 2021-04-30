import { RoleDto } from '../../role/dto/RoleDto';
import { PublicUserDto } from '../../user/dto/public-user-dto';
import { PermissionDto } from '../../permission/dto/permission.dto';
import { IsNotEmpty } from 'class-validator';
import { PublicWorkoutPlanDto } from '../../workout-plan/dto/public-workout-plan.dto';

export class WorkoutPlanCollaboratorInvitationDto {
  constructor(
    id: number,
    workoutPlan: PublicWorkoutPlanDto,
    invitee: PublicUserDto,
    inviter: PublicUserDto,
    role: RoleDto,
    permission: PermissionDto,
  ) {
    this.id = id;
    this.workoutPlan = workoutPlan;
    this.invitee = invitee;
    this.inviter = inviter;
    this.role = role;
    this.permission = permission;
  }

  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly workoutPlan: PublicWorkoutPlanDto;

  @IsNotEmpty()
  readonly invitee: PublicUserDto;

  @IsNotEmpty()
  readonly inviter: PublicUserDto;

  @IsNotEmpty()
  readonly role: RoleDto;

  @IsNotEmpty()
  readonly permission: PermissionDto;
}
