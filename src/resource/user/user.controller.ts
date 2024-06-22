import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserResponseDto } from './dto/user.response.dto';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('사용자')
@Controller('user')
export class UserController {
    constructor(private readonly userFacade: UserFacade) {}

    @ApiOperation({ summary: '내 프로필 조회', description: '자신의 프로필을 조회합니다.' })
    @ApiOkResponse({ type: UserResponseDto })
    @Get('profile')
    async getProfile(@UserId() userId: number) {
        return await this.userFacade.getProfile(userId);
    }
}
