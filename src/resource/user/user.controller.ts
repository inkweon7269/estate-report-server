import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    ConflictException,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UploadedFile,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '@root/resource/user/user.service';
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from '@root/resource/user/dtos/user.dto';
import { LocalServiceAuthGuard } from '@root/auth/guards/local-service.guard';
import { AuthService } from '@root/auth/auth.service';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { User } from '@root/auth/auth.decorator';
import { UserEntity } from '@root/entities/user.entity';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from '@root/auth/guards/jwt-refresh.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogInterceptor } from '@root/common/interceptor/log.interceptor';
import { HttpExceptionFilter } from '@root/common/exception-filter/http.exception-filter';

@ApiTags('사용자')
@Controller('v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService,
    ) {}

    @ApiOperation({ summary: '회원가입', description: '회원가입합니다.' })
    @ApiBody({ type: CreateUserDto })
    @Post('join')
    async postJoin(@Body() createUserDto: CreateUserDto) {
        return await this.userService.postJoin(createUserDto);
    }

    @ApiOperation({ summary: '로그인', description: '로그인을 합니다.' })
    @ApiBody({ type: LoginUserDto })
    @Post('login')
    async postLogin(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateServiceUser(loginUserDto.email, loginUserDto.password);
        console.log(user);

        const accessToken = await this.authService.generateAccessToken(user);
        const refreshToken = await this.authService.generateRefreshToken(user);

        await this.userService.setCurrentRefreshToken(refreshToken, user.id);

        res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }

    @ApiOperation({ summary: 'Refresh Token으로 Access Token 갱신', description: '' })
    @Get('refresh')
    async getRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refreshToken'];
        const { accessToken: newAccessToken, user } = await this.authService.refresh(refreshToken);

        res.setHeader('Authorization', 'Bearer ' + newAccessToken);
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
        });

        res.send({ accessToken: newAccessToken, user });
    }

    // 권한 문제로 다시 살펴볼 필요가 있음
    // https://velog.io/@from_numpy/NestJS-How-to-implement-Refresh-Token-with-JWT
    @ApiOperation({ summary: '로그아웃' })
    // @UseGuards(JwtRefreshGuard)
    @UseGuards(JwtServiceAuthGuard)
    @Post('logout')
    async logout(@User('id') userId: number, @Res({ passthrough: true }) res: Response) {
        await this.userService.removeRefreshToken(userId);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return true;
    }

    @ApiOperation({ summary: '내 정보 조회', description: '사용자 아이디와 메일 정보를 조회합니다.' })
    @UseGuards(JwtServiceAuthGuard)
    /**
     * serialization
     *  - 직렬화
     *  - 현재 시스템에서 사용되는 (NestJS) 데이터 구조를 다른 시스템에서도 쉽게 사용할 수 있는 포맷으로 변환
     *  - class object에서 JSON 포맷으로 변환
     * deserialization
     *  - 역직렬화
     *  - 위 개념의 반대
     */
    // @UseInterceptors(ClassSerializerInterceptor)
    // @UseInterceptors(LogInterceptor)
    @UseFilters(HttpExceptionFilter)
    @Get('profile')
    async getProfile(@User('id') userId: number) {
        throw new BadRequestException('에러 테스트');

        return await this.userService.getProfile(userId);
    }
}
