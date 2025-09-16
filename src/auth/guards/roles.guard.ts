import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get(Roles, context.getClass());
    if (!role) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;

    return role === userRole;
  }
}
