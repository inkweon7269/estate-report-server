import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ReportService } from '@root/resource/report/report.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '@root/common/dtos/pagination.dto';
import {
    CreateLikeDto,
    DeleteLikeDto,
    CreateReportDto,
    ReportPaginationDto,
    UpdateReportDto,
} from '@root/resource/report/dtos/report.dto';
import { ApartService } from '@root/resource/apart/apart.service';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { User } from '@root/auth/auth.decorator';
import { ImageType } from '@root/common/entities/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { ReportImagesService } from '@root/resource/report/images.service';
import { TransactionInterceptor } from '@root/common/interceptor/transaction.interceptor';
import { QueryRunner } from '@root/common/decorator/query-runner.decorator';
import { IsReportMineOrAdminGuard } from '@root/common/guard/is-report-mine-or-admin.guard';

@Controller('v1/report')
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
        private readonly reportImagesService: ReportImagesService,
        private readonly apartService: ApartService,
        private readonly dataSource: DataSource,
    ) {}

    @ApiOperation({ summary: '즐겨찾기 추가', description: '보고서를 즐겨찾기에 추가합니다.' })
    @ApiBody({ type: CreateLikeDto })
    @Post('like')
    async createLike(@User('id') userId: number, @Body() createLikeDto: CreateLikeDto) {
        const report = await this.reportService.findByReportId({ reportId: createLikeDto.reportId, userId });

        if (!report) {
            throw new NotFoundException('존재하지 않는 보고서입니다.');
        }

        const like = await this.reportService.findByLike({ userId, reportId: createLikeDto.reportId });

        if (like) {
            throw new ConflictException('이미 즐겨찾기에 추가된 보고서입니다.');
        }

        return await this.reportService.createLike({ userId, reportId: createLikeDto.reportId });
    }

    @ApiOperation({ summary: '즐겨찾기 제거', description: '즐겨찾기에서 보고서를 제거합니다.' })
    @ApiBody({ type: DeleteLikeDto })
    @Delete('like')
    async deleteLike(@User('id') userId: number, @Body() deleteLikeDto: DeleteLikeDto) {
        const like = await this.reportService.findByLike({ userId, reportId: deleteLikeDto.reportId });

        if (!like) {
            throw new NotFoundException('즐겨찾기 항목을 찾을 수 없습니다.');
        }

        return await this.reportService.deleteLike({ userId, reportId: deleteLikeDto.reportId });
    }

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
    async getReports(@User('id') userId: number, @Query() reportPaginationDto: ReportPaginationDto) {
        return await this.reportService.getReports(userId, reportPaginationDto);
    }

    @ApiOperation({ summary: '보고서 상세 정보 조회', description: '보고서 상세 정보를 가져온다.' })
    @ApiParam({
        name: 'reportId',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @Get(':reportId')
    async getReport(@User('id') userId: number, @Param('reportId', ParseIntPipe) reportId: number) {
        const found = await this.reportService.findByReportId({
            reportId,
            userId,
        });

        if (!found) {
            throw new NotFoundException('해당 보고서를 찾을 수 없습니다.');
        }

        return await this.reportService.getReport(reportId);
    }

    @ApiOperation({ summary: '보고서 생성', description: '보고서를 생성합니다.' })
    @ApiBody({ type: CreateReportDto })
    @UseInterceptors(TransactionInterceptor)
    @Post()
    async createReport(
        @User('id') userId: number,
        @Body() createReportDto: CreateReportDto,
        @QueryRunner() queryRunner: QR,
    ) {
        const isExistApart = await this.apartService.findById(createReportDto.apartId);

        if (!isExistApart) {
            throw new NotFoundException('해당 아파트를 찾을 수 없습니다.');
        }

        const isExistReport = await this.reportService.findByApartId({
            userId,
            apartId: createReportDto.apartId,
        });

        if (isExistReport) {
            throw new ConflictException('이미 해당 아파트에 대한 보고서가 존재합니다.');
        }

        const report = await this.reportService.createReport(userId, createReportDto, queryRunner);

        if (createReportDto.images.length) {
            for (let i = 0; i < createReportDto.images.length; i++) {
                await this.reportImagesService.createReportImage(
                    {
                        report,
                        order: i,
                        path: createReportDto.images[i],
                        type: ImageType.REPORT_IMAGE,
                    },
                    queryRunner,
                );
            }
        }

        return await this.reportService.findByReportId({ reportId: report.id, userId, queryRunner });
    }

    @ApiOperation({ summary: '보고서 수정', description: '보고서를 수정합니다.' })
    @ApiParam({
        name: 'reportId',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @ApiBody({ type: UpdateReportDto })
    @UseGuards(IsReportMineOrAdminGuard)
    @Put(':reportId')
    async updateReport(@Param('reportId', ParseIntPipe) reportId: number, @Body() updateReportDto: UpdateReportDto) {
        return await this.reportService.updateReport(reportId, updateReportDto);
    }

    @ApiOperation({ summary: '보고서 삭제', description: '보고서를 삭제합니다.' })
    @ApiParam({
        name: 'reportId',
        description: '보고서 아이디',
        example: 8,
        required: true,
    })
    @UseGuards(IsReportMineOrAdminGuard)
    @Delete(':reportId')
    async deleteReport(@User('id') userId: number, @Param('reportId', ParseIntPipe) reportId: number) {
        return await this.reportService.deleteReport({ userId, reportId });
    }
}
