import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthFacade } from './auth.facade';
import { CreateUserDto } from '../user/dto/user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { LoginUserDto } from './dto/auth.dto';
import { LocalServiceAuthGuard } from '../../common/guards/local-service.guard';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authFacade: AuthFacade) {}

    @ApiOperation({ summary: '사용자 생성', description: '사용자를 생성합니다.' })
    @ApiBody({ type: CreateUserDto })
    @Public()
    @Post('register')
    async postUser(@Body() createUserDto: CreateUserDto) {
        return await this.authFacade.postUser(createUserDto);
    }

    @ApiOperation({ summary: '로그인', description: '로그인합니다.' })
    @ApiBody({ type: LoginUserDto })
    @UseGuards(LocalServiceAuthGuard)
    @Public()
    @Post('login')
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authFacade.loginUser(req.user);

        res.setHeader('Authorization', 'Bearer ' + accessToken);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    @ApiOperation({ summary: 'Access Token 갱신', description: 'Refresh Token을 사용하여 Access Token을 갱신합니다.' })
    @UseGuards(JwtRefreshGuard)
    @Public()
    @Get('refresh')
    async getRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = await this.authFacade.refresh(req.user);

        res.setHeader('Authorization', 'Bearer ' + accessToken);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
        });

        return {
            accessToken,
        };
    }

    @ApiOperation({
        summary: '로그아웃',
        description: '로그아웃 후 Access Token, Refresh Token 정보를 모두 삭제합니다.',
    })
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.authFacade.logout(req.user);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return {
            message: '로그아웃',
        };
    }
}
