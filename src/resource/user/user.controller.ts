import { BadRequestException, Body, ConflictException, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '@root/resource/user/user.service';
import { CreateUserDto, LoginUserDto } from '@root/resource/user/dtos/user.dto';
import { LocalServiceAuthGuard } from '@root/auth/guards/local-service.guard';
import { AuthService } from '@root/auth/auth.service';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { User, UserId } from '@root/auth/auth.decorator';
import { UserEntity } from '@root/entities/user.entity';

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
        const user = await this.userService.findOneByEmail(createUserDto.email);

        if (user) {
            throw new ConflictException('이미 생성된 유저입니다.');
        }

        const hashPassword = await this.userService.hashPassword(createUserDto.password);
        createUserDto.password = hashPassword;

        return await this.userService.postJoin(createUserDto);
    }

    @ApiOperation({ summary: '로그인', description: '로그인을 합니다.' })
    @ApiBody({ type: LoginUserDto })
    @UseGuards(LocalServiceAuthGuard)
    @Post('login')
    async postLogin(@User() user: UserEntity, @Body() loginUserDto: LoginUserDto) {
        const token = this.authService.loginServiceUser(user);
        return token;
    }

    @ApiOperation({ summary: '내 정보 조회', description: '사용자 아이디와 메일 정보를 조회합니다.' })
    @UseGuards(JwtServiceAuthGuard)
    @Get('profile')
    async getProfile(@UserId() userId: number) {
        return await this.userService.getProfile(userId);
    }
}
