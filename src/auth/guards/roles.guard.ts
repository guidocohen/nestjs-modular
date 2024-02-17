import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { Role } from '../models/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler()); // Get the roles from the decorator. Example: ['admin', 'customer']
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken; // User from the token deserialized

    const isAuth = roles.some((role) => role === user.role);
    if (!isAuth) {
      throw new ForbiddenException(
        "You don't have permission to do this action.",
      );
    }
    return isAuth;
  }
}
