import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '@root/entities/report.entity';
import { ReportController } from '@root/resource/report/report.controller';
import { ReportService } from '@root/resource/report/report.service';
import { ApartModule } from '@root/resource/apart/apart.module';
import { ReportUserBridgeEntity } from '@root/entities/report-user-bridge.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity, ReportUserBridgeEntity]), ApartModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule {}
