import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@root/common/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        /**
         * Roles annotation 에 대한 metadata를 가져와야 한다.
         *
         * Reflector
         * getAllAndOverride()
         */
        const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRole) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new UnauthorizedException('토큰을 제공해주세요!');
        }

        if (user.role !== requiredRole) {
            throw new ForbiddenException(`이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한이 필요합니다.`);
        }

        return true;
    }
}
