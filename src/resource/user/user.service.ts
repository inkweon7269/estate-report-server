import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    async getUsers() {
        return await this.userRepo.findAll();
    }

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

    async deleteUser(id: number) {
        return await this.userRepo.delete({ id });
    }

    async findByEmail(email: string) {
        return await this.userRepo.findByEmail(email);
    }

    async validateServiceUser(email: string, password: string): Promise<any> {
        const existingUser = await this.findByEmail(email);

        if (!existingUser) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        // 전달받은 비밀번호와 DB에 저장된 비밀번호가 일치하는지 확인
        if (!(await bcrypt.compare(password, existingUser.password))) {
            throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
        }

        return existingUser;
    }
}
