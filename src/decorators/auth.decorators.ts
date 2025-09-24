import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const ENTITY_ACCESS_KEY = 'entity_access';
export const EntityAccess = (entityTable: string, requiredRole?: string) => 
  SetMetadata(ENTITY_ACCESS_KEY, { entityTable, requiredRole });
