import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user/user.entity';
import { WorkoutPlanRoleEntity } from '../../workout-plan-role/workout-plan-role.entity';
import { WorkoutPlanPermissionEntity } from '../../workout-plan-permission/workout-plan-permission.entity';
import { WorkoutPlanCollaboratorInvitationDto } from '../dto/response/workout-plan-collaborator-invitation.dto';
import { WorkoutPlan } from '../../workout-plan/workout-plan.entity';
import { AbstractEntity } from "../../../../utils/abstract/abstract.entity";

@Entity({ name: 'workout_plan_collaborator_invitation' })
export class WorkoutPlanCollaboratorInvitationEntity extends AbstractEntity {
  @Column({ type: 'integer', name: 'workout_plan_id' })
  workoutPlanId: string;

  @Column({ name: 'invitee_user_id' })
  inviteeUserId: string;

  @Column({ name: 'inviter_user_id' })
  inviterUserId: string;

  @Column({ type: 'smallint', name: 'role_id' })
  roleId: string;

  @Column({ type: 'smallint', name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => WorkoutPlan, (wPlan) => wPlan.id)
  @JoinColumn({ name: 'workout_plan_id' })
  workoutPlan: WorkoutPlan;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'invitee_user_id' })
  invitee: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'inviter_user_id' })
  inviter: User;

  @ManyToOne(() => WorkoutPlanRoleEntity, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: WorkoutPlanRoleEntity;

  @ManyToOne(() => WorkoutPlanPermissionEntity, (permission) => permission.id)
  @JoinColumn({ name: 'permission_id' })
  permission: WorkoutPlanPermissionEntity;

  createWorkoutPlanInvitationDto() {
    return new WorkoutPlanCollaboratorInvitationDto(
      this.id,
      this.workoutPlan.createPublicWorkoutDto(),
      this.invitee.toPublicUserDto(),
      this.inviter.toPublicUserDto(),
      this.role.createRoleDto(),
      this.permission.createPermissionDto(),
    );
  }
}
