import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.header('Authorization');
        return authHeader === 'hello';
    }
}
