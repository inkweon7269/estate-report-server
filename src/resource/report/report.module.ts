import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '../../domain/report/entity/report.entity';
import { ReportRepository } from '../../domain/report/repository/report.repository';
import { ReportFacade } from './report.facade';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity]), UserModule],
    controllers: [ReportController],
    providers: [ReportFacade, ReportService, ReportRepository],
})
export class ReportModule {}
