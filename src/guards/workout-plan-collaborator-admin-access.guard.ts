import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionEnum } from '../modules/permission/permission.enum';

/**
 * Guard only allows access if the collaborator has write access
 *
 */
@Injectable()
export class WorkoutPlanCollaboratorAdminAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const collaborator = req.collaborator;
    if (!collaborator) {
      throw new NotFoundException("Collaborator doesn't exist");
    }
    return collaborator.permission.name === PermissionEnum.admin;
  }
}
