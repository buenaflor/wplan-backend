import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'workout_plan_collaborator' })
export class WorkoutPlanCollaboratorEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'integer', name: 'workout_plan_id' })
  workoutPlanId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'smallint', name: 'role_id' })
  roleId: number;

  @Column({ type: 'smallint', name: 'permission_id' })
  permissionId: number;
}
