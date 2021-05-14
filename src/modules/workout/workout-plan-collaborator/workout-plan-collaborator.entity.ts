import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';
import { WorkoutPlanRoleEntity } from '../workout-plan-role/workout-plan-role.entity';
import { WorkoutPlanPermissionEntity } from '../workout-plan-permission/workout-plan-permission.entity';
import { WorkoutPlanCollaboratorDto } from './dto/response/workout-plan-collaborator.dto';
import { WorkoutPlan } from '../workout-plan/workout-plan.entity';
import { AbstractEntity } from '../../../utils/abstract/abstract.entity';

@Entity({ name: 'workout_plan_collaborator' })
export class WorkoutPlanCollaboratorEntity extends AbstractEntity {
  @Column({ type: 'integer', name: 'workout_plan_id' })
  workoutPlanId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'smallint', name: 'role_id' })
  roleId: string;

  @Column({ type: 'smallint', name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => WorkoutPlan, (wPlan) => wPlan.id)
  @JoinColumn({ name: 'workout_plan_id' })
  workoutPlan: WorkoutPlan;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => WorkoutPlanRoleEntity, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: WorkoutPlanRoleEntity;

  @ManyToOne(() => WorkoutPlanPermissionEntity, (permission) => permission.id)
  @JoinColumn({ name: 'permission_id' })
  permission: WorkoutPlanPermissionEntity;

  createWorkoutPlanCollaboratorDto() {
    return new WorkoutPlanCollaboratorDto(
      this.id,
      this.role.createRoleDto(),
      this.user.toPublicUserDto(),
      this.permission.createPermissionDto(),
    );
  }
}
