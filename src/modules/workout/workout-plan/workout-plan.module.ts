// workout-plan.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';
import { WorkoutPlan } from './workout-plan.entity';
import { UserModule } from '../../user/user.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';
import { PermissionModule } from '../../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { WorkoutDayModule } from '../workout-day/workout-day.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutPlan]),
    forwardRef(() => UserModule),
    WorkoutDayModule,
    WorkoutPlanCollaboratorModule,
    PermissionModule,
    RoleModule,
  ],
  providers: [WorkoutPlanService],
  controllers: [WorkoutPlanController],
  exports: [WorkoutPlanService],
})
export class WorkoutPlanModule {}
