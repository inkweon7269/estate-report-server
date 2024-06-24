import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../../domain/auth/repository/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepo: AuthRepository,
    ) {}

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

    async createUserAuth(user) {
        return await this.authRepo.save(
            this.authRepo.create({
                user,
            }),
        );
    }

    async validateServiceUser(email: string, password: string): Promise<any> {
        const existingAuth = await this.authRepo.findByEmail(email);

        if (!existingAuth) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        // 전달받은 비밀번호와 DB에 저장된 비밀번호가 일치하는지 확인
        if (!(await bcrypt.compare(password, existingAuth.user.password))) {
            throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
        }

        return existingAuth.user;
    }

    async validateServiceRefresh(userId: number, refreshToken: string): Promise<any> {
        const existingAuth = await this.authRepo.findByUserId(userId);

        if (!existingAuth) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, existingAuth.refreshToken);

        if (!isRefreshTokenMatching) {
            throw new ForbiddenException('Refresh 토큰이 일치하지 않습니다.');
        }

        return existingAuth.user;
    }

    async updateRefreshToken(userId: number, refreshToken: string, refreshTokenExp: Date) {
        const auth = await this.authRepo.findByUserId(userId);
        await this.authRepo.update(auth.id, {
            refreshToken,
            refreshTokenExp,
        });
    }

    async removeRefreshToken(userId: number) {
        const auth = await this.authRepo.findByUserId(userId);
        await this.authRepo.update(auth.id, {
            refreshToken: null,
            refreshTokenExp: null,
        });
    }
}
