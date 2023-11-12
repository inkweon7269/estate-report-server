import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const User = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const req: { user?: UserEntity } = context.switchToHttp().getRequest();
    return req.user;
});

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const req: { user?: UserEntity } = context.switchToHttp().getRequest();
    return Number(req.user.id);
});
