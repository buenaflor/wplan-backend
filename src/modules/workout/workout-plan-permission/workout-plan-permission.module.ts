import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanPermissionEntity } from './workout-plan-permission.entity';
import { WorkoutPlanPermissionService } from './workout-plan-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlanPermissionEntity])],
  providers: [WorkoutPlanPermissionService],
  exports: [WorkoutPlanPermissionService],
})
export class WorkoutPlanPermissionModule {}
