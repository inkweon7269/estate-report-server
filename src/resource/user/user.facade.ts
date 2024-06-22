import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class UserFacade {
    constructor(private readonly userService: UserService) {}

    async getProfile(userId: number) {
        const user = await this.userService.getProfile(userId);
        return UserResponseDto.of(user);
    }
}
