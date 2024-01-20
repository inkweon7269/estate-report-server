// src/auth/auth.service.ts
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from '@root/resource/user/dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateServiceUser(email: string, password: string): Promise<any> {
        const user = await this.userRepo.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        // 전달받은 비밀번호와 DB에 저장된 비밀번호가 일치하는지 확인
        if (!(await bcrypt.compare(password, user.password))) {
            throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
        }

        return user;
    }

    loginServiceUser(user: UserEntity) {
        const payload = {
            id: user.id,
            email: user.email,
            createAt: user.createAt,
        };
        return {
            // 사용자 정보를 JWT 안에 전달
            token: this.jwtService.sign(payload),
        };
    }

    async generateAccessToken(user: UserEntity): Promise<string> {
        const payload = {
            id: user.id,
            email: user.email,
        };
        return this.jwtService.signAsync(payload);
    }

    async generateRefreshToken(user: UserEntity): Promise<string> {
        const payload = {
            id: user.id,
            email: user.email,
        };
        return this.jwtService.signAsync(
            { id: payload.id },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
            },
        );
    }

    async refresh(refreshToken) {
        let decodedRefreshToken;
        try {
            decodedRefreshToken = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch (e) {
            throw new UnauthorizedException('Invalid token!');
        }

        const userId = decodedRefreshToken.id;

        const user = await this.userRepo.findOne({
            where: {
                id: userId,
            },
        });

        if (!user.currentRefreshToken) {
            throw new UnauthorizedException('Invalid user!');
        }

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentRefreshToken);

        if (!isRefreshTokenMatching) {
            throw new UnauthorizedException('Invalid user!');
        }

        const accessToken = await this.generateAccessToken(user);
        return { accessToken, user: { id: user.id, email: user.email } };
    }
}
