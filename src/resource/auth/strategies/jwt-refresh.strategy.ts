import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private userService: UserService) {
        super({
            secretOrKey: 'VMiEc4e6cfadfcvbret2345rasdgadsfg23qf',
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.refreshToken;
                },
            ]),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.cookies['refreshToken'];

        return await this.userService.validateServiceRefresh(payload.id, refreshToken);
    }
}
