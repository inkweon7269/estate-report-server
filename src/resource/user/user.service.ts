import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@root/resource/user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { join, basename } from 'path';
import { PUBLIC_FOLDER_PATH, TEMP_FOLDER_PATH, USERS_IMAGE_PATH } from '@root/common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly configService: ConfigService,
    ) {}

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

    // 사용자 이미지가 성공했을 때m temp -> users로 옮기는 용도로 사용
    async createUserImage(dto: CreateUserDto) {
        /**
         * DTO 이미지 이름을 기반으로 파일 경로를 생성한다.
         */
        const tempFilePath = join(TEMP_FOLDER_PATH, dto.image);

        try {
            // 파일이 존재하는지 확인 존재하지 않는다면 에러를 던짐
            await promises.access(tempFilePath);
        } catch (e) {
            throw new BadRequestException('존재하지 않는 파일입니다.');
        }

        // 파일의 이름만 가져오기
        // aaa/bbb/abc.jpg -> abc.jpg
        const fileName = basename(tempFilePath);

        // 새로 이동할 폴더의 경로 + 이미지 이름
        const newPath = join(USERS_IMAGE_PATH, fileName);

        // 파일 옮기기
        await promises.rename(tempFilePath, newPath);

        return true;
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
