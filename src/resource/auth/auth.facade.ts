import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserDto } from './dto/auth.dto';

@Injectable()
export class AuthFacade {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    async postUser(createUserDto: CreateUserDto) {
        const user = await this.userService.postUser(createUserDto);
        return await this.authService.generateAccessToken(user);
    }

    async loginUser(user: UserDto) {
        return await this.authService.generateAccessToken(user);
    }
}
