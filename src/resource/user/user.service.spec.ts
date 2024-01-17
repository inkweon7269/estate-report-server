import { UserService } from '@root/resource/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('UserService', () => {
    let service: UserService;
    let userRepo: MockRepository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                ConfigService,
                { provide: getRepositoryToken(UserEntity), useValue: createMockRepository() },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepo = module.get<MockRepository>(getRepositoryToken(UserEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        describe('사용자 아이디가 존재하는 경우', () => {
            it('사용자 반환', async () => {
                const userId = 62;
                const expectedUser = {
                    id: 62,
                    createAt: '2024-01-16T15:48:58.958Z',
                    email: 'in04@test.com',
                };

                userRepo.findOne.mockReturnValue(expectedUser);
                const user = await service.getProfile(userId);
                expect(user).toEqual(expectedUser);
            });
        });

        describe('사용자 아이디가 존재하지 않는 경우', () => {
            it('throw the "NotFoundException"', async () => {
                const userId = 12;

                userRepo.findOne.mockReturnValue(undefined);

                try {
                    await service.getProfile(userId);
                    expect(false).toBeTruthy();
                } catch (err) {
                    expect(err).toBeInstanceOf(NotFoundException);
                    expect(err.message).toEqual(`User #${userId} not found`);
                }
            });
        });
    });

    describe('postJoin', () => {
        describe('새로운 사용자가 가입하는 경우', () => {
            it('should create a new user', async () => {
                const user = {
                    email: 'in12@test.com',
                    password: 'abcdefg',
                    passwordChk: 'abcdefg',
                };

                userRepo.findOne.mockReturnValue(undefined);
                userRepo.create.mockReturnValue(user);
                userRepo.save.mockReturnValue(user);

                const result = await service.postJoin(user);

                expect(userRepo.create).toHaveBeenCalledWith(user);
                expect(userRepo.save).toHaveBeenCalledWith(user);
                expect(result.email).toEqual(user.email);
            });
        });

        describe('가입된 이메일 주소가 존재하는 경우', () => {
            it('throw the "ConflictException"', async () => {
                const createUser = {
                    email: 'in11@test.com',
                    password: 'abcdefg',
                    passwordChk: 'abcdefg',
                };

                const existingUser = {
                    email: 'in11@test.com',
                    updateAt: '2024-01-17 01:59:12',
                    deleteAt: null,
                    currentRefreshToken: null,
                    currentRefreshTokenExp: null,
                    id: 69,
                    createAt: '2024-01-17 01:59:12',
                };

                userRepo.findOne.mockReturnValue(existingUser);

                try {
                    await service.postJoin(createUser);
                } catch (err) {
                    expect(err).toBeInstanceOf(ConflictException);
                    expect(err.message).toEqual(`이미 생성된 유저입니다.`);
                }
            });
        });
    });
});
