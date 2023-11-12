import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { LikeService } from '@root/resource/like/like.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserId } from '@root/auth/auth.decorator';
import { PaginationDto } from '@root/common/dtos/pagination.dto';
import { CreateLikeDto, DeleteLikeDto } from '@root/resource/like/dtos/like.dto';
import { ReportService } from '@root/resource/report/report.service';

@UseGuards(JwtServiceAuthGuard)
@Controller('v1/like')
export class LikeController {
    constructor(
        private likeService: LikeService,
        private reportService: ReportService,
    ) {}

    @ApiOperation({ summary: '즐겨찾기 추가', description: '보고서를 즐겨찾기에 추가합니다.' })
    @ApiBody({ type: CreateLikeDto })
    @Post()
    async createLike(@UserId() userId: number, @Body() createLikeDto: CreateLikeDto) {
        const report = await this.reportService.findByReportId({ id: createLikeDto.reportId, userId });

        if (!report) {
            throw new NotFoundException('존재하지 않는 보고서입니다.');
        }

        const like = await this.likeService.findByReportId({ userId, reportId: report.id });

        if (like) {
            throw new ConflictException('이미 즐겨찾기에 추가된 보고서입니다.');
        }

        return await this.likeService.createLike(userId, createLikeDto);
    }

    @ApiOperation({ summary: '즐겨찾기 제거', description: '즐겨찾기에서 보고서를 제거합니다.' })
    @ApiBody({ type: DeleteLikeDto })
    @Delete()
    async deleteLike(@UserId() userId: number, @Body() deleteLikeDto: DeleteLikeDto) {
        const like = await this.likeService.findByLikeId({
            userId,
            reportId: deleteLikeDto.reportId,
        });

        if (!like) {
            throw new NotFoundException('즐겨찾기 항목을 찾을 수 없습니다.');
        }

        return await this.likeService.deleteLike(like.id);
    }
}
