import { FindManyOptions } from 'typeorm';
import { CommentEntity } from '@root/entities/comment.entity';

export const DEFAULT_COMMENT_FIND_OPTIONS: FindManyOptions<CommentEntity> = {
    relations: {
        user: true,
    },
    select: {
        user: {
            id: true,
            email: true,
        },
    },
};
