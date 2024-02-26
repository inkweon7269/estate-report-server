import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const User = createParamDecorator((data: keyof UserEntity | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UserEntity;

    if (!user) {
        throw new InternalServerErrorException('Request에 user 프로퍼티가 존재하지 않습니다!');
    }

    if (data) {
        return user[data];
    }

    return user;
});

/*
export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const req: { user?: UserEntity } = context.switchToHttp().getRequest();
    return Number(req.user.id);
});
*/
