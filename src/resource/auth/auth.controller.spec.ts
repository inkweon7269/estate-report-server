import { AuthController } from './auth.controller';
import { AuthFacade } from './auth.facade';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/auth.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let authFacade: AuthFacade;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthFacade,
                    useValue: {
                        postUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get(AuthController);
        authFacade = module.get(AuthFacade);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('회원가입', () => {
        it('신규 사용자를 생성합니다.', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser = {
                accessToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAsImVtYWlsIjoiZGV2MTQyQGdtYWlsLmNvbSIsImlhdCI6MTcxOTc2MzAwNywiZXhwIjoxNzE5NzY0ODA3fQ.QgbX0J36zeSoTTUEHjAFbm8u_4-5ZLb-BoA4JGe-FLU',
                refreshToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAsImlhdCI6MTcxOTc2MzAwNywiZXhwIjoxNzE5NzY0ODA3fQ.4d9hOcfioD7psjCqraVqAzRyP6dlRCUja-qzqcrBX6Q',
            };

            // mockResolvedValue(성공)했을 때 반환값을 지정합니다.
            jest.spyOn(authFacade, 'postUser').mockResolvedValue(mockUser);

            // authController의 postUser 메서드를 호출하여 결과를 result 변수에 저장합니다.
            const result = await authController.postUser(createUserDto);

            // postUser 메서드가 반환한 결과가 mockUser와 같은지 확인합니다.
            expect(result).toBe(mockUser);

            // postUser 메서드가 createUserDto를 인수로 호출되었는지 확인합니다.
            expect(authFacade.postUser).toHaveBeenCalledWith(createUserDto);
        });

        it('중복된 이메일로 회원가입을 시도할 때 에러를 반환합니다.', async () => {
            const createUserDto: CreateUserDto = {
                email: 'duplicate@example.com',
                password: 'password123',
            };

            // mockRejectedValue(실패)했을 때 반환값을 지정합니다.
            jest.spyOn(authFacade, 'postUser').mockRejectedValue(
                new BadRequestException('이미 존재하는 이메일입니다.'),
            );

            // rejects.toThrow() : 비동기 함수가 호출될 때 발생하는 예외를 검증하는 데 사용됩니다
            await expect(authController.postUser(createUserDto)).rejects.toThrow(BadRequestException);
            expect(authFacade.postUser).toHaveBeenCalledWith(createUserDto);
        });
    });
});
