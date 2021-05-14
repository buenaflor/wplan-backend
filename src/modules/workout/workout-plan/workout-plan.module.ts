// workout-plan.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanService } from './service/workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';
import { WorkoutPlan } from './workout-plan.entity';
import { UserModule } from '../../user/user.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';
import { WorkoutPlanPermissionModule } from '../workout-plan-permission/workout-plan-permission.module';
import { WorkoutPlanRoleModule } from '../workout-plan-role/workout-plan-role.module';
import { WorkoutDayModule } from '../workout-day/workout-day.module';
import { WorkoutPlanAuthorizationService } from './service/workout-plan-authorization.service';
import { CaslModule } from '../../../common/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutPlan]),
    forwardRef(() => UserModule),
    WorkoutDayModule,
    WorkoutPlanCollaboratorModule,
    WorkoutPlanPermissionModule,
    WorkoutPlanRoleModule,
    CaslModule,
  ],
  providers: [WorkoutPlanService, WorkoutPlanAuthorizationService],
  controllers: [WorkoutPlanController],
  exports: [WorkoutPlanService],
})
export class WorkoutPlanModule {}
