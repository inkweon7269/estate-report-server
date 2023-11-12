import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '@root/entities/like.entity';
import { LikeController } from '@root/resource/like/like.controller';
import { LikeService } from '@root/resource/like/like.service';
import { ReportModule } from '@root/resource/report/report.module';

@Module({
    imports: [TypeOrmModule.forFeature([LikeEntity]), ReportModule],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
