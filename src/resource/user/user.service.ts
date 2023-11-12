import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@root/resource/user/dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async getProfile(userId: number) {
        const user = await this.userRepo.findOne({
            select: {
                createAt: true,
                id: true,
                email: true,
            },
            where: { id: userId },
        });
        return user;
    }

    async postJoin(createUserDto: CreateUserDto) {
        const user = this.userRepo.create(createUserDto);
        const result = await this.userRepo.save(user);
        const { password, ...responseUser } = result;
        return responseUser;
    }

    // 비밀번호 암호화
    async hashPassword(password: string) {
        return await bcrypt.hash(password, 11);
    }

    // 동일 이메일 검사
    async findOneByEmail(email: string) {
        return await this.userRepo.findOne({
            where: { email },
            withDeleted: true,
        });
    }
}
