import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from '@root/resource/user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { join, basename } from 'path';
import { PUBLIC_FOLDER_PATH, TEMP_FOLDER_PATH, USERS_IMAGE_PATH } from '@root/common/const/path.const';
import { promises } from 'fs';
import { UserFollowersEntity } from '@root/entities/user-followers.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(UserFollowersEntity)
        private readonly userFollowersRepo: Repository<UserFollowersEntity>,

        private readonly configService: ConfigService,
    ) {}

    getUserRepo(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<UserEntity>(UserEntity) : this.userRepo;
    }

    getUserFollowRepo(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<UserFollowersEntity>(UserFollowersEntity) : this.userFollowersRepo;
    }

    async getProfile(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User #${userId} not found`);
        }

        return user;
    }

    async postJoin(createUserDto: CreateUserDto) {
        const user = await this.findOneByEmail(createUserDto.email);

        if (user) {
            throw new ConflictException('이미 생성된 유저입니다.');
        }

        const hashPassword = await this.hashPassword(createUserDto.password);
        createUserDto.password = hashPassword;

        const createUser = this.userRepo.create({ ...createUserDto });
        const result = await this.userRepo.save(createUser);

        const { password, ...responseUser } = result;
        return responseUser;
    }

    async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
        const userFollowersRepo = this.getUserFollowRepo(qr);

        await userFollowersRepo.save({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            },
        });

        return true;
    }

    async getFollowers(userId: number, includeNotConfirmed: boolean) {
        const where = {
            followee: {
                id: userId,
            },
        };

        if (!includeNotConfirmed) {
            where['isConfirmed'] = true;
        }

        const result = await this.userFollowersRepo.find({
            where,
            relations: {
                follower: true,
                followee: true,
            },
        });

        return result.map((x) => ({
            id: x.follower.id,
            email: x.follower.email,
            inConfirmed: x.isConfirmed,
        }));
    }

    async confirmFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
        const userFollowersRepo = this.getUserFollowRepo(qr);

        const existing = await userFollowersRepo.findOne({
            where: {
                follower: {
                    id: followerId,
                },
                followee: {
                    id: followeeId,
                },
            },
            relations: {
                follower: true,
                followee: true,
            },
        });

        if (!existing) {
            throw new BadRequestException('존재하지 않는 팔로우 요청입니다.');
        }

        await userFollowersRepo.save({
            ...existing,
            isConfirmed: true,
        });

        return true;
    }

    async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
        const userFollowersRepo = this.getUserFollowRepo(qr);

        await userFollowersRepo.delete({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            },
        });

        return true;
    }

    async incrementFollowerCount(userId: number, qr?: QueryRunner) {
        const userRepo = this.getUserRepo(qr);

        await userRepo.increment(
            {
                id: userId,
            },
            'followerCount',
            1,
        );
    }

    async decrementFollowerCount(userId: number, qr?: QueryRunner) {
        const userRepo = this.getUserRepo(qr);

        await userRepo.decrement(
            {
                id: userId,
            },
            'followerCount',
            1,
        );
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

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentRefreshToken = await this.getCurrentHashedRefreshToken(refreshToken);
        const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
        await this.userRepo.update(userId, {
            currentRefreshToken,
            currentRefreshTokenExp,
        });
    }

    async getCurrentHashedRefreshToken(refreshToken: string) {
        // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다.
        // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다.
        return await bcrypt.hash(refreshToken, 11);
    }

    async getCurrentRefreshTokenExp(): Promise<Date> {
        const currentDate = new Date();
        // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt)
        const currentRefreshTokenExp = new Date(
            currentDate.getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')),
        );
        return currentRefreshTokenExp;
    }

    async removeRefreshToken(userId: number): Promise<any> {
        return await this.userRepo.update(userId, {
            currentRefreshToken: null,
            currentRefreshTokenExp: null,
        });
    }
}
