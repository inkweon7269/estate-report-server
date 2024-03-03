import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '@root/entities/report.entity';
import { ReportController } from '@root/resource/report/report.controller';
import { ReportService } from '@root/resource/report/report.service';
import { ApartModule } from '@root/resource/apart/apart.module';
import { ReportUserBridgeEntity } from '@root/entities/report-user-bridge.entity';
import { ImageEntity } from '@root/common/entities/image.entity';
import { ReportImagesService } from '@root/resource/report/images.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity, ReportUserBridgeEntity, ImageEntity]), ApartModule],
    controllers: [ReportController],
    providers: [ReportService, ReportImagesService],
    exports: [ReportService],
})
export class ReportModule {}
