import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReportEntity } from '../../entities/report.entity';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { EntityExistsPipe } from '../../common/pipes/entity-exists.pipe';
import { ReportFacade } from './report.facade';
import { ReportResponseDto } from './dto/report.response.dto';

@ApiTags('보고서')
@Controller('report')
export class ReportController {
    constructor(private readonly reportFacade: ReportFacade) {}

    @ApiOperation({ summary: '전체 보고서 조회', description: '전체 보고서를 가져옵니다.' })
    @ApiOkResponse({ type: [ReportResponseDto] })
    @Get()
    async getReports() {
        return await this.reportFacade.getReports();
    }

    @ApiOperation({ summary: '보고서 조회', description: '보고서를 조회합니다.' })
    @ApiParam({
        name: 'id',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @ApiOkResponse({ type: ReportResponseDto })
    @Get(':id')
    async getReport(@Param('id', EntityExistsPipe(ReportEntity)) id: number) {
        return await this.reportFacade.getReport(id);
    }

    @ApiOperation({ summary: '보고서 생성', description: '보고서를 생성합니다.' })
    @ApiBody({ type: CreateReportDto })
    @ApiCreatedResponse({ type: ReportResponseDto })
    @Post()
    async postReport(@Body() createReportDto: CreateReportDto) {
        return await this.reportFacade.postReport(createReportDto);
    }

    @ApiOperation({ summary: '보고서 수정', description: '보고서를 수정합니다.' })
    @ApiParam({
        name: 'id',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @ApiBody({ type: UpdateReportDto })
    @ApiOkResponse({ type: ReportResponseDto })
    @Put(':id')
    async putReport(@Param('id', EntityExistsPipe(ReportEntity)) id: number, @Body() updateReportDto: UpdateReportDto) {
        return await this.reportFacade.putReport(id, updateReportDto);
    }

    @ApiOperation({ summary: '보고서 삭제', description: '보고서를 삭제합니다.' })
    @ApiParam({
        name: 'id',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @Delete(':id')
    async deleteReport(@Param('id', EntityExistsPipe(ReportEntity)) id: number) {
        return await this.reportFacade.deleteReport(id);
    }
}
