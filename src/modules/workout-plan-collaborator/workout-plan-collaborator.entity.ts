import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { WorkoutPlanCollaboratorDto } from './dto/workout-plan-collaborator.dto';

@Entity({ name: 'workout_plan_collaborator' })
export class WorkoutPlanCollaboratorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'workout_plan_id' })
  workoutPlanId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'smallint', name: 'role_id' })
  roleId: number;

  @Column({ type: 'smallint', name: 'permission_id' })
  permissionId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => RoleEntity, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.id)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  createWorkoutPlanCollaboratorDto() {
    return new WorkoutPlanCollaboratorDto(
      this.id,
      this.role.createRoleDto(),
      this.user.createPublicUserDto(),
      this.permission.createPermissionDto(),
    );
  }
}
