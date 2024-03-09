import { PartialType, PickType } from '@nestjs/swagger';
import { CommentEntity } from '@root/entities/comment.entity';

export class CreateCommentDto extends PickType(CommentEntity, ['comment']) {}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
