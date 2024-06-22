import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async generateAccessToken(userDto: UserDto) {
        const payload = {
            id: userDto.id,
            email: userDto.email,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }

    async generateRefreshToken(userDto: UserDto) {
        const payload = {
            id: userDto.id,
            email: userDto.email,
        };

        return {
            refreshToken: await this.jwtService.signAsync(
                { id: payload.id },
                {
                    secret: 'VMiEc4e6cfadfcvbret2345rasdgadsfg23qf',
                    expiresIn: '1800000',
                },
            ),
        };
    }

    async setRefreshToken(refreshToken: string) {
        const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);
        const refreshTokenExp = await this.getRefreshTokenExp();

        return {
            hashedRefreshToken,
            refreshTokenExp,
        };
    }

    // 리프레시 토큰을 암호화합니다.
    async getHashedRefreshToken(refreshToken: string) {
        return await bcrypt.hash(refreshToken, 10);
    }

    // 리프레시 토큰 유효 기간을 생성합니다.
    async getRefreshTokenExp(): Promise<Date> {
        const currentDate = new Date();
        const refreshTokenExp = new Date(currentDate.getTime() + parseInt('1800000'));
        return refreshTokenExp;
    }
}
