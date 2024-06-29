import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/report.dto';
import { ReportFacade } from './report.facade';
import { ReportResponseDto } from './dto/report.response.dto';
import { UserId } from '../../common/decorators/user.decorator';
import { PaginationDto } from '../../common/dtos/input.dto';
import { ApiPaginationResponse } from '../../common/decorators/api-pagination-response.decorator';

@ApiTags('보고서')
@Controller('report')
export class ReportController {
    constructor(private readonly reportFacade: ReportFacade) {}

    @ApiOperation({ summary: '보고서 조회', description: '생성한 보고서를 조회합니다.' })
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
}
