import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // To obtain metadata from the request
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
