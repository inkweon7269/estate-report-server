import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';
import { EntityExistsPipe } from '../../common/pipes/entity-exists.pipe';
import { UserFacade } from './user.facade';
import { UserResponseDto } from './dto/user.response.dto';

@ApiTags('사용자')
@Controller('user')
export class UserController {
    constructor(private readonly userFacade: UserFacade) {}

    @ApiOperation({ summary: '전체 사용자 조회', description: '전체 사용자를 가져옵니다.' })
    @ApiOkResponse({ type: [UserResponseDto] })
    @Public()
    @Get()
    async getUsers() {
        return this.userFacade.getUsers();
    }

    @ApiOperation({ summary: '사용자 삭제', description: '사용자를 삭제합니다.' })
    @ApiParam({
        name: 'id',
        description: '사용자 아이디',
        example: 8,
        required: true,
    })
    @Public()
    @Delete(':id')
    async deleteUser(@Param('id', EntityExistsPipe(UserEntity)) id: number) {
        return await this.userFacade.deleteUser(id);
    }
}
