import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../domain/user/entity/user.entity';

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const req: { user: UserEntity } = context.switchToHttp().getRequest();
    return Number(req.user.id);
});
