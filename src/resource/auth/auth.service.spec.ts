import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/user/repository/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AuthEntity } from '../../domain/user/entity/auth.entity';
import { UserEntity } from '../../domain/user/entity/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userRepo: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('mocked_token'),
                    },
                },
                {
                    provide: UserRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                        createUser: jest.fn(),
                        findById: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userRepo = module.get<UserRepository>(UserRepository);
    });

    describe('postUser', () => {
        it('이미 존재하는 이메일인 경우 BadRequestException를 반환합니다.', async () => {
            const createUserDto = { email: 'test@example.com', password: 'password' };
            const auth = new AuthEntity();
            const existingUser = new UserEntity();
            existingUser.email = createUserDto.email;
            existingUser.password = createUserDto.password;
            existingUser.auth = auth;

            jest.spyOn(userRepo, 'findByEmail').mockResolvedValueOnce(existingUser);

            await expect(authService.postUser(createUserDto)).rejects.toThrow(BadRequestException);
        });

        it('새 사용자를 생성한다', async () => {
            const createUserDto = { email: 'new@example.com', password: 'password' };
            jest.spyOn(userRepo, 'findByEmail').mockResolvedValueOnce(null);
            jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed_password'));

            const user = new UserEntity();
            user.id = 1;
            user.email = createUserDto.email;
            user.password = 'hashed_password';
            user.auth = new AuthEntity();

            jest.spyOn(userRepo, 'createUser').mockResolvedValueOnce(user);

            const result = await authService.postUser(createUserDto);
            expect(result).toEqual(user);
        });
    });

    describe('generateAccessToken', () => {
        it('유효한 사용자 정보를 바탕으로 액세스 토큰을 생성한다', async () => {
            const userDto = { id: 1, email: 'user@example.com' };
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_access_token');

            const result = await authService.generateAccessToken(userDto);
            expect(result).toEqual({ accessToken: 'mocked_access_token' });
            expect(jwtService.signAsync).toHaveBeenCalled();
        });
    });

    describe('generateRefreshToken', () => {
        it('유효한 사용자 정보를 바탕으로 리프레시 토큰을 생성한다', async () => {
            const userDto = { id: 1, email: 'user@example.com' };
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_refresh_token');

            const result = await authService.generateRefreshToken(userDto);
            expect(result).toEqual({ refreshToken: 'mocked_refresh_token' });
            expect(jwtService.signAsync).toHaveBeenCalled();
        });
    });

    describe('validateServiceUser', () => {
        it('등록되지 않은 사용자를 검증할 때 ForbiddenException을 발생시킨다', async () => {
            jest.spyOn(userRepo, 'findByEmail').mockResolvedValueOnce(null);

            await expect(authService.validateServiceUser('user@example.com', 'password')).rejects.toThrow(
                ForbiddenException,
            );
        });

        it('잘못된 비밀번호를 제공한 경우 ForbiddenException을 발생시킨다', async () => {
            const auth = new AuthEntity();
            const user = new UserEntity();
            user.email = 'user@example.com';
            user.password = 'hashed_password';
            user.auth = auth;

            jest.spyOn(userRepo, 'findByEmail').mockResolvedValueOnce(user);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

            await expect(authService.validateServiceUser('user@example.com', 'wrong_password')).rejects.toThrow(
                ForbiddenException,
            );
        });
    });

    describe('updateRefreshToken', () => {
        it('사용자의 리프레시 토큰과 만료 시간을 업데이트한다', async () => {
            // AuthEntity 및 UserEntity 인스턴스 생성
            const auth = new AuthEntity();
            auth.refreshToken = null;
            auth.refreshTokenExp = null;

            const user = new UserEntity();
            user.id = 1;
            user.createdAt = new Date();
            user.email = 'user@example.com';
            user.password = 'password';
            user.auth = auth;

            jest.spyOn(userRepo, 'findById').mockResolvedValue(user);
            jest.spyOn(userRepo, 'save').mockImplementation(async (entity: UserEntity) => entity);

            await authService.updateRefreshToken(1, 'new_refresh_token', new Date('2025-01-01'));

            expect(user.auth.refreshToken).toEqual('new_refresh_token');
            expect(user.auth.refreshTokenExp).toEqual(new Date('2025-01-01'));

            // save 함수 호출 확인
            expect(userRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    auth: {
                        refreshToken: 'new_refresh_token',
                        refreshTokenExp: new Date('2025-01-01'),
                    },
                }),
            );
        });
    });

    describe('removeRefreshToken', () => {
        it('사용자의 리프레시 토큰을 제거한다', async () => {
            const auth = new AuthEntity();
            auth.refreshToken = 'existing_token';
            auth.refreshTokenExp = new Date();

            const user = new UserEntity();
            user.id = 1;
            user.createdAt = new Date();
            user.email = 'user@example.com';
            user.password = 'password';
            user.auth = auth;

            jest.spyOn(userRepo, 'findById').mockResolvedValue(user);
            jest.spyOn(userRepo, 'save').mockImplementation(async (entity: UserEntity) => entity);

            await authService.removeRefreshToken(1);

            expect(user.auth.refreshToken).toBeNull();
            expect(user.auth.refreshTokenExp).toBeNull();
            expect(userRepo.save).toHaveBeenCalledWith(user);
        });
    });
});
