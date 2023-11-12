import { PickType } from '@nestjs/swagger';
import { LikeEntity } from '@root/entities/like.entity';

export class CreateLikeDto extends PickType(LikeEntity, ['reportId']) {}

export class DeleteLikeDto extends CreateLikeDto {}
