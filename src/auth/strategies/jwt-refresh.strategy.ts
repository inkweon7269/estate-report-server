import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {
        super({
            secretOrKey: configService.get('JWT_REFRESH_SECRET'),
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
        const user = await this.userRepo.findOne({
            where: {
                currentRefreshToken: refreshToken,
                id: payload.id,
            },
        });

        return user;
    }
}
