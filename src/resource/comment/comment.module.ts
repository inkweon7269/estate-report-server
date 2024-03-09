import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '@root/entities/comment.entity';
import { CommonModule } from '@root/common/common.module';
import { ReportExistsMiddleware } from '@root/middleware/report-exists.middleware';
import { ReportModule } from '@root/resource/report/report.module';

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity]), ReportModule, CommonModule],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ReportExistsMiddleware).forRoutes(CommentController);
    }
}
