import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from '@root/common/common.service';
import { PaginateCommentsDto } from '@root/resource/comment/dtos/paginate-comments.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '@root/entities/comment.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { CreateCommentDto, UpdateCommentDto } from '@root/resource/comment/dtos/comment.dto';
import { DEFAULT_COMMENT_FIND_OPTIONS } from '@root/resource/comment/const/default-comment-find-options.const';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>,
        private readonly commonService: CommonService,
    ) {}

    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<CommentEntity>(CommentEntity) : this.commentRepo;
    }

    paginateComments(reportId: number, dto: PaginateCommentsDto) {
        return this.commonService.paginate(
            dto,
            this.commentRepo,
            {
                ...DEFAULT_COMMENT_FIND_OPTIONS,
                where: {
                    reportId,
                },
            },
            `v1/report/:${reportId}/comment`,
        );
    }

    async getCommentById(id: number) {
        const comment = await this.commentRepo.findOne({
            ...DEFAULT_COMMENT_FIND_OPTIONS,
            where: {
                id,
            },
        });

        console.log(comment);

        if (!comment) {
            throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
        }

        return comment;
    }

    async createComment(user: UserEntity, reportId: number, dto: CreateCommentDto, qr?: QueryRunner) {
        const repository = this.getRepository(qr);

        return await repository.save({
            ...dto,
            user,
            reportId,
        });
    }

    async updateComment(commentId: number, dto: UpdateCommentDto) {
        const comment = await this.commentRepo.preload({
            id: commentId,
            ...dto,
        });

        if (!comment) {
            throw new BadRequestException('존재하지 않는 댓글입니다.');
        }

        return await this.commentRepo.save(comment);
    }

    async deleteComment(id: number, qr?: QueryRunner) {
        const repository = this.getRepository(qr);

        const comment = await repository.findOne({
            where: {
                id,
            },
        });

        if (!comment) {
            throw new BadRequestException('존재하지 않는 댓글입니다.');
        }

        await repository.softDelete(id);

        return id;
    }

    async isCommentMine(userId: number, commentId: number) {
        return await this.commentRepo.exist({
            where: {
                id: commentId,
                userId,
            },
        });
    }
}
