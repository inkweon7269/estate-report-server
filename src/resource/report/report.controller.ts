import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/report.dto';
import { ReportFacade } from './report.facade';
import { ReportResponseDto } from './dto/report.response.dto';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('보고서')
@Controller('report')
export class ReportController {
    constructor(private readonly reportFacade: ReportFacade) {}

    @ApiOperation({ summary: '보고서 생성', description: '보고서를 생성합니다.' })
    @ApiBody({ type: CreateReportDto })
    @ApiCreatedResponse({ type: ReportResponseDto })
    @Post()
    async postReport(@UserId() userId: number, @Body() createReportDto: CreateReportDto) {
        return await this.reportFacade.postReport(userId, createReportDto);
    }
}
