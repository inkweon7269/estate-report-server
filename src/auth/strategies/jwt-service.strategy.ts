import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_ACCESS_SECRET } from '@root/common/const/env-keys.const';

@Injectable()
export class JwtServiceStrategy extends PassportStrategy(Strategy, 'jwt-service') {
    constructor(private readonly configService: ConfigService) {
        super({
            secretOrKey: configService.get(ENV_JWT_ACCESS_SECRET),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        return {
            id: payload.id,
            email: payload.email,
        };
    }
}
