import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard only allows access if the requestor is the owner
 * or has explicit access to the resource
 *
 */
@Injectable()
export class WorkoutPlanAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { ownerName, workoutPlanName } = req.params;
    const authUsername = req.user.username;
    const authUserId = req.user.userId;

    // TODO: collaborators can also invite
    if (ownerName !== authUsername) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
