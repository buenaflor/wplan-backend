import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { RoleEntity } from '../../role/role.entity';
import { PermissionEntity } from '../../permission/permission.entity';
import { WorkoutPlanCollaboratorInvitationDto } from '../dto/workout-plan-collaborator-invitation.dto';
import { WorkoutPlan } from '../../workout-plan/workout-plan.entity';

@Entity({ name: 'workout_plan_collaborator_invitation' })
export class WorkoutPlanCollaboratorInvitationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'workout_plan_id' })
  workoutPlanId: number;

  @Column({ type: 'bigint', name: 'invitee_user_id' })
  inviteeUserId: number;

  @Column({ type: 'bigint', name: 'inviter_user_id' })
  inviterUserId: number;

  @Column({ type: 'smallint', name: 'role_id' })
  roleId: number;

  @Column({ type: 'smallint', name: 'permission_id' })
  permissionId: number;

  @ManyToOne(() => WorkoutPlan, (wPlan) => wPlan.id)
  @JoinColumn({ name: 'workout_plan_id' })
  workoutPlan: WorkoutPlan;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'invitee_user_id' })
  invitee: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'inviter_user_id' })
  inviter: User;

  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.id)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  createWorkoutPlanCollaboratorDto() {
    return new WorkoutPlanCollaboratorInvitationDto(
      this.id,
      this.workoutPlan.createPublicWorkoutDto(),
      this.invitee.createPublicUserDto(),
      this.inviter.createPublicUserDto(),
      this.role.createRoleDto(),
      this.permission.createPermissionDto(),
    );
  }
}
