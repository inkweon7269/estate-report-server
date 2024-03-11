import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { PaginateCommentsDto } from '@root/resource/comment/dtos/paginate-comments.dto';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { CreateCommentDto, UpdateCommentDto } from '@root/resource/comment/dtos/comment.dto';
import { User } from '@root/auth/auth.decorator';
import { UserEntity } from '@root/entities/user.entity';
import { Roles } from '@root/common/decorator/roles.decorator';
import { RolesEnum } from '@root/common/const/roles.const';
import { IsCommentMineOrAdminGuard } from '@root/common/guard/is-comment-mine-or-admin.guard';
import { QueryRunner as QR } from 'typeorm';
import { QueryRunner } from '@root/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from '@root/common/interceptor/transaction.interceptor';
import { ReportService } from '@root/resource/report/report.service';

@Controller('v1/report/:reportId/comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly reportService: ReportService,
    ) {}

    @Get()
    getComments(@Param('reportId', ParseIntPipe) reportId: number, @Query() query: PaginateCommentsDto) {
        return this.commentService.paginateComments(reportId, query);
    }

    @Get(':commentId')
    getComment(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.getCommentById(commentId);
    }

    @UseInterceptors(TransactionInterceptor)
    @Post()
    async postComment(
        @User() user: UserEntity,
        @Param('reportId', ParseIntPipe) reportId: number,
        @Body() body: CreateCommentDto,
        @QueryRunner() qr: QR,
    ) {
        const res = await this.commentService.createComment(user, reportId, body, qr);
        await this.reportService.incrementComment(reportId, qr);

        return res;
    }

    @Patch(':commentId')
    async patchComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() body: UpdateCommentDto) {
        return await this.commentService.updateComment(commentId, body);
    }

    // @Roles(RolesEnum.ADMIN)
    @UseGuards(IsCommentMineOrAdminGuard)
    @UseInterceptors(TransactionInterceptor)
    @Delete(':commentId')
    async deleteComment(
        @Param('reportId', ParseIntPipe) reportId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @QueryRunner() qr: QR,
    ) {
        const res = await this.commentService.deleteComment(commentId);
        await this.reportService.decrementCommentCount(reportId, qr);

        return res;
    }
}
