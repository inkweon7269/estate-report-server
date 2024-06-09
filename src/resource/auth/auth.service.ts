import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/auth.dto';

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
}
