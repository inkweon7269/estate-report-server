import { RolesEnum } from '@root/common/const/roles.const';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'user_roles';

export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);
