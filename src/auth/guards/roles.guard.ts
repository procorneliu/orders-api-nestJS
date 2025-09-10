import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  mathRoles(roles: string[], userRole: string) {
    const roleMath = roles.some((role) => role === userRole);

    if (roleMath) return true;

    throw new ForbiddenException('You do not have sufficient rights to access this resource.');
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request.user;

    return this.mathRoles(roles, user.role);
  }
}
