// src/auth/auth.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {}

    async validateServiceUser(email: string, password: string): Promise<any> {
        const user = await this.userRepo.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ForbiddenException('등록되지 않은 사용자입니다.');
        }

        // 전달받은 비밀번호와 DB에 저장된 비밀번호가 일치하는지 확인
        if (!(await bcrypt.compare(password, user.password))) {
            throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
        }

        return user;
    }

    loginServiceUser(user: UserEntity) {
        const payload = {
            id: user.id,
            email: user.email,
            createAt: user.createAt,
        };
        return {
            // 사용자 정보를 JWT 안에 전달
            token: this.jwtService.sign(payload),
        };
    }
}
