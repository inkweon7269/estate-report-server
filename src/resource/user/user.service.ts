import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/user/repository/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    async getProfile(userId: number) {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new NotFoundException('존재하지 않는 사용자입니다.');
        }

        return user;
    }

    async findByEmail(email: string) {
        return await this.userRepo.findByEmail(email);
    }
}
