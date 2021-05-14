import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutPlanPermissionDto } from './dto/workout-plan-permission.dto';
import { WorkoutPlanPermissionEnum } from './workout-plan-permission.enum';
import { AbstractEntity } from "../../../utils/abstract/abstract.entity";

@Entity({ name: 'workout_plan_permission' })
export class WorkoutPlanPermissionEntity extends AbstractEntity{

  @Column({ type: 'varchar', length: '32' })
  name: string;

  createPermissionDto() {
    return new WorkoutPlanPermissionDto(this.id, this.name);
  }
}
