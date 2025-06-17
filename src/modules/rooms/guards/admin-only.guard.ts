import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role !== Role.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
} 