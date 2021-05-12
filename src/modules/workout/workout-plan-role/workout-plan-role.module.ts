import { Module } from '@nestjs/common';
import { WorkoutPlanRoleService } from './workout-plan-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanRoleEntity } from './workout-plan-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlanRoleEntity])],
  providers: [WorkoutPlanRoleService],
  exports: [WorkoutPlanRoleService],
})
export class WorkoutPlanRoleModule {}
