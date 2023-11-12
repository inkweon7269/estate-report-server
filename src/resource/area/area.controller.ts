import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AreaService } from '@root/resource/area/area.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApartService } from '@root/resource/apart/apart.service';

@Controller('v1/area')
export class AreaController {
    constructor(
        private areaService: AreaService,
        private apartService: ApartService,
    ) {}

    @ApiOperation({ summary: '시도 조회', description: '시도 목록을 조회합니다.' })
    @Get('a1')
    async getA1All() {
        return await this.areaService.getA1All();
    }

    @ApiOperation({ summary: '시군구 조회', description: '선택한 시도의 시군구 목록을 조회합니다.' })
    @ApiParam({
        name: 'id',
        description: '시도 아이디',
        example: 1,
        required: true,
    })
    @Get('a1/:id')
    async getA2All(@Param('id', ParseIntPipe) id: number) {
        return await this.areaService.getA2All(id);
    }

    @ApiOperation({ summary: '읍면동 조회', description: '선택한 시군구의 읍면동 목록을 조회합니다.' })
    @ApiParam({
        name: 'id',
        description: '시군구 아이디',
        example: 3,
        required: true,
    })
    @Get('a2/:id')
    async getA3All(@Param('id', ParseIntPipe) id: number) {
        return await this.areaService.getA3All(id);
    }

    @ApiOperation({ summary: '아파트 조회', description: '선택한 읍면동의 아파트 목록을 조회합니다.' })
    @ApiParam({
        name: 'id',
        description: '읍면동 아이디',
        example: 3,
        required: true,
    })
    @Get('a3/:id')
    async getApartAll(@Param('id', ParseIntPipe) id: number) {
        return await this.apartService.getApartAll(id);
    }
}
