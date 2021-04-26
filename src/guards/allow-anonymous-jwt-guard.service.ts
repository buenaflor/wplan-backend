import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AllowAnonymousJwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    return user;
  }
}
