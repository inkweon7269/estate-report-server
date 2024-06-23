import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    async postUser(createUserDto: CreateUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);

        if (existingUser) {
            throw new BadRequestException(`이미 존재하는 이메일입니다.`);
        }

        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashPassword;

        const createUser = this.userRepo.create(createUserDto);
        return await this.userRepo.save(createUser);
    }

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
