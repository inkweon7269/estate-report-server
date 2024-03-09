import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PaginateCommentsDto } from '@root/resource/comment/dtos/paginate-comments.dto';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';
import { CreateCommentDto, UpdateCommentDto } from '@root/resource/comment/dtos/comment.dto';
import { User } from '@root/auth/auth.decorator';
import { UserEntity } from '@root/entities/user.entity';
import { Roles } from '@root/common/decorator/roles.decorator';
import { RolesEnum } from '@root/common/const/roles.const';
import { IsCommentMineOrAdminGuard } from '@root/common/guard/is-comment-mine-or-admin.guard';

@Controller('v1/report/:reportId/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    getComments(@Param('reportId', ParseIntPipe) reportId: number, @Query() query: PaginateCommentsDto) {
        return this.commentService.paginateComments(reportId, query);
    }

    @Get(':commentId')
    getComment(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.getCommentById(commentId);
    }

    @Post()
    postComment(
        @User() user: UserEntity,
        @Param('reportId', ParseIntPipe) reportId: number,
        @Body() body: CreateCommentDto,
    ) {
        return this.commentService.createComment(user, reportId, body);
    }

    @Patch(':commentId')
    async patchComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() body: UpdateCommentDto) {
        return await this.commentService.updateComment(commentId, body);
    }

    // @Roles(RolesEnum.ADMIN)
    @UseGuards(IsCommentMineOrAdminGuard)
    @Delete(':commentId')
    async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
        return await this.commentService.deleteComment(commentId);
    }
}
