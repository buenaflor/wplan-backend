import { SetMetadata } from '@nestjs/common';
import { WorkoutPlanPermissionEnum } from '../workout-plan-permission.enum';

export const PERMISSIONS_KEY = 'roles';
export const Permissions = (...permissions: WorkoutPlanPermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
