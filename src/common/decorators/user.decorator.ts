import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const req: { user: UserEntity } = context.switchToHttp().getRequest();
    return Number(req.user.id);
});
