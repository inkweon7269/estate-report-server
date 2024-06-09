import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class UserFacade {
    constructor(private readonly userService: UserService) {}

    async getUsers() {
        const users = await this.userService.getUsers();
        return users.map((user) => UserResponseDto.of(user));
    }

    async deleteUser(id: number) {
        return await this.userService.deleteUser(id);
    }
}
