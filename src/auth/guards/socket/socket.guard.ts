import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { UserService } from '@root/resource/user/user.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class SocketGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext) {
        const socket = context.switchToWs().getClient();
        const headers = socket.handshake.headers;

        const rawToken = headers['authorization'];

        if (!rawToken) {
            throw new WsException('토큰이 없습니다!');
        }

        try {
            const payload = jwt.verify(rawToken, process.env.JWT_ACCESS_SECRET) as JwtPayload;
            socket.user = await this.userService.findOneByEmail(payload.email);
            socket.token = rawToken;

            return true;
        } catch (e) {
            throw new WsException('토큰이 유효하지 않습니다.');
        }
    }
}
