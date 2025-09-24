import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountLinksService } from '../services/account-links.service';
import { ENTITY_ACCESS_KEY } from '../decorators/auth.decorators';

@Injectable()
export class EntityAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accountLinksService: AccountLinksService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const entityAccess = this.reflector.getAllAndOverride<{
      entityTable: string;
      requiredRole?: string;
    }>(ENTITY_ACCESS_KEY, [context.getHandler(), context.getClass()]);

    if (!entityAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (!user || !user.accountId) {
      return false;
    }

    const entityId = params.entityId || params.id;
    if (!entityId) {
      return false;
    }

    try {
      return await this.accountLinksService.hasAccess(
        user.accountId,
        entityAccess.entityTable,
        entityId,
        entityAccess.requiredRole,
      );
    } catch {
      return false;
    }
  }
}
