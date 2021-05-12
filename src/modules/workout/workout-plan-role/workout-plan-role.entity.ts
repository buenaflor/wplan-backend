import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutPlanRoleDto } from './dto/workout-plan-role.dto';
import { AbstractEntity } from "../../../utils/abstract/abstract.entity";

@Entity({ name: 'workout_plan_role' })
export class WorkoutPlanRoleEntity extends AbstractEntity {

  @Column({ type: 'varchar', length: '32' })
  name: string;

  createRoleDto() {
    return new WorkoutPlanRoleDto(this.id);
  }
}
