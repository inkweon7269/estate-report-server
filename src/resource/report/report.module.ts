import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '../../domain/report/entity/report.entity';
import { ReportRepository } from '../../domain/report/repository/report.repository';
import { UserRepository } from '../../domain/user/repository/user.repository';
import { ReportFacade } from './report.facade';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity])],
    controllers: [ReportController],
    providers: [ReportFacade, ReportService, ReportRepository, UserRepository],
})
export class ReportModule {}
