import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { CommentService } from '@root/resource/comment/comment.service';
import { Request } from 'express';
import { UserEntity } from '@root/entities/user.entity';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
    constructor(private readonly commentService: CommentService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request & { user: UserEntity };

        const { user } = req;

        if (!user) {
            throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
        }

        /**
         * Admin일 경우 그냥 패스
         */
        /*
          if (user.role === RolesEnum) {
              return true;
          }
          */

        const commentId = req.params.commentId;

        if (!commentId) {
            throw new BadRequestException('보고서 아이디가 파라미터로 제공되어야 합니다.');
        }

        const isOk = await this.commentService.isCommentMine(user.id, Number(commentId));

        if (!isOk) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        return true;
    }
}
