import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../permission.enum';

export const PERMISSIONS_KEY = 'roles';
export const Permissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
