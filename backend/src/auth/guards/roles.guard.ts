import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Default deny: a route with no @Roles() decorator is not open to everyone
    if (!required) {
      throw new ForbiddenException('No roles defined for this route');
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
