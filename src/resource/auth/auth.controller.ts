import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthFacade } from './auth.facade';
import { CreateUserDto } from '../user/dto/user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { LoginUserDto } from './dto/auth.dto';
import { LocalServiceAuthGuard } from '../../common/guards/local-service.guard';

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
    async login(@Req() req) {
        return await this.authFacade.loginUser(req.user);
    }
}
