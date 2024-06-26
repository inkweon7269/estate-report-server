import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/auth.dto';

@Injectable()
export class AuthFacade {
    constructor(private readonly authService: AuthService) {}

    async postUser(createUserDto: CreateUserDto) {
        const user = await this.authService.postUser(createUserDto);
        return await this.authService.generateAccessToken(user);
    }

    async loginUser(user: UserDto) {
        const { accessToken } = await this.authService.generateAccessToken(user);
        const { refreshToken } = await this.authService.generateRefreshToken(user);
        const { hashedRefreshToken, refreshTokenExp } = await this.authService.setRefreshToken(refreshToken);

        await this.authService.updateRefreshToken(user.id, hashedRefreshToken, refreshTokenExp);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refresh(user) {
        const { accessToken } = await this.authService.generateAccessToken(user);
        return {
            accessToken,
        };
    }

    async logout(user) {
        await this.authService.removeRefreshToken(user.id);
    }
}
