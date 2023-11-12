import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ReportService } from '@root/resource/report/report.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '@root/common/dtos/pagination.dto';
import { CreateReportDto, ReportPaginationDto, UpdateReportDto } from '@root/resource/report/dtos/report.dto';
import { ApartService } from '@root/resource/apart/apart.service';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { UserId } from '@root/auth/auth.decorator';

@UseGuards(JwtServiceAuthGuard)
@Controller('v1/report')
export class ReportController {
    constructor(
        private reportService: ReportService,
        private apartService: ApartService,
    ) {}

    @ApiOperation({ summary: '전체 보고서 조회', description: '보고서 목록을 조회합니다.' })
    @ApiQuery({
        name: 'page',
        description: '조회할 페이지',
        example: 1,
        required: true,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 노출 개수',
        example: 30,
        required: true,
    })
    @Get()
    async getReports(@UserId() userId: number, @Query() reportPaginationDto: ReportPaginationDto) {
        return await this.reportService.getReports(userId, reportPaginationDto);
    }

    @ApiOperation({ summary: '보고서 상세 정보 조회', description: '보고서 상세 정보를 가져온다.' })
    @ApiParam({
        name: 'id',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @Get(':id')
    async getReport(@UserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        const found = await this.reportService.findByReportId({
            id,
            userId,
        });

        if (!found) {
            throw new NotFoundException('해당 보고서를 찾을 수 없습니다.');
        }

        return await this.reportService.getReport(id);
    }

    @ApiOperation({ summary: '보고서 생성', description: '보고서를 생성합니다.' })
    @ApiBody({ type: CreateReportDto })
    @Post()
    async createReport(@UserId() userId: number, @Body() createReportDto: CreateReportDto) {
        const apart = await this.apartService.findById(createReportDto.apartId);

        if (!apart) {
            throw new NotFoundException('해당 아파트를 찾을 수 없습니다.');
        }

        const report = await this.reportService.findByApartId({
            userId,
            apartId: createReportDto.apartId,
        });

        if (report) {
            throw new ConflictException('이미 해당 아파트에 대한 보고서가 존재합니다.');
        }

        return await this.reportService.createReport(userId, createReportDto);
    }

    @ApiOperation({ summary: '보고서 수정', description: '보고서를 수정합니다.' })
    @ApiParam({
        name: 'id',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @ApiBody({ type: UpdateReportDto })
    @Put(':id')
    async updateReport(
        @UserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateReportDto: UpdateReportDto,
    ) {
        const found = await this.reportService.findByReportId({
            id,
            userId,
        });

        if (!found) {
            throw new NotFoundException('해당 보고서를 찾을 수 없습니다.');
        }

        return await this.reportService.updateReport(id, updateReportDto);
    }

    @ApiOperation({ summary: '보고서 삭제', description: '보고서를 삭제합니다.' })
    @ApiParam({
        name: 'id',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @Delete(':id')
    async deleteReport(@UserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        const found = await this.reportService.findByReportId({
            id,
            userId,
        });

        if (!found) {
            throw new NotFoundException('해당 보고서를 찾을 수 없습니다.');
        }

        return await this.reportService.deleteReport(id);
    }
}
