import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportFacade } from './report.facade';
import { ReportResponseDto } from './dto/report.response.dto';
import { UserId } from '../../common/decorators/user.decorator';
import { PaginationDto } from '../../common/dtos/input.dto';
import { ApiPaginationResponse } from '../../common/decorators/api-pagination-response.decorator';

@ApiTags('보고서')
@Controller('report')
export class ReportController {
    constructor(private readonly reportFacade: ReportFacade) {}

    @ApiOperation({ summary: '전체 보고서 조회', description: '전체 보고서를 조회합니다.' })
    @ApiPaginationResponse(ReportResponseDto)
    @Get()
    async getReports(@UserId() userId: number, @Query() paginationDto: PaginationDto) {
        return await this.reportFacade.getReports(userId, paginationDto);
    }

    @ApiOperation({ summary: '보고서 생성', description: '보고서를 생성합니다.' })
    @ApiCreatedResponse({ type: ReportResponseDto })
    @Post()
    async postReport(@UserId() userId: number, @Body() createReportDto: CreateReportDto) {
        return await this.reportFacade.postReport(userId, createReportDto);
    }

    @ApiOperation({ summary: '보고서 상세', description: '보고서 상세를 조회합니다.' })
    @ApiParam({
        name: 'reportId',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @ApiOkResponse({ type: ReportResponseDto })
    @Get(':reportId')
    async getReport(@UserId() userId: number, @Param('reportId') reportId: number) {
        return await this.reportFacade.getReport(userId, reportId);
    }

    @ApiOperation({ summary: '보고서 삭제', description: '보고서를 삭제합니다.' })
    @ApiParam({
        name: 'reportId',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @Delete(':reportId')
    async deleteReport(@UserId() userId: number, @Param('reportId') reportId: number) {
        return await this.reportFacade.deleteReport(userId, reportId);
    }

    @ApiOperation({ summary: '보고서 수정', description: '보고서를 수정합니다.' })
    @ApiParam({
        name: 'reportId',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @ApiBody({ type: UpdateReportDto })
    @Put(':reportId')
    async putReport(
        @UserId() userId: number,
        @Param('reportId') reportId: number,
        @Body() updateReportDto: UpdateReportDto,
    ) {
        return await this.reportFacade.putReport(userId, reportId, updateReportDto);
    }
}
