import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/user/repository/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepo: UserRepository,
    ) {}

    async postUser(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepo.findByEmail(createUserDto.email);

        if (existingUser) {
            throw new BadRequestException(`이미 존재하는 이메일입니다.`);
        }

        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashPassword;

        return await this.userRepo.createUser(createUserDto);
    }

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

    async validateServiceUser(email: string, password: string): Promise<any> {
        const existingUser = await this.userRepo.findByEmail(email);

        if (!existingUser) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        // 전달받은 비밀번호와 DB에 저장된 비밀번호가 일치하는지 확인
        if (!(await bcrypt.compare(password, existingUser.password))) {
            throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
        }

        return existingUser;
    }

    async validateServiceRefresh(userId: number, refreshToken: string): Promise<any> {
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, existingUser.auth.refreshToken);

        if (!isRefreshTokenMatching) {
            throw new ForbiddenException('Refresh 토큰이 일치하지 않습니다.');
        }

        return existingUser;
    }

    async updateRefreshToken(userId: number, refreshToken: string, refreshTokenExp: Date) {
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        existingUser.auth.refreshToken = refreshToken;
        existingUser.auth.refreshTokenExp = refreshTokenExp;

        await this.userRepo.save(existingUser);
    }

    async removeRefreshToken(userId: number) {
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        existingUser.auth.refreshToken = null;
        existingUser.auth.refreshTokenExp = null;

        await this.userRepo.save(existingUser);
    }
}
