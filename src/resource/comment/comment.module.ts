import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '@root/entities/comment.entity';
import { CommonModule } from '@root/common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity]), CommonModule],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
