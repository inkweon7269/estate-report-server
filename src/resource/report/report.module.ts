import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '../../entities/report.entity';
import { ReportRepository } from './report.repository';
import { UserRepository } from '../user/user.repository';
import { ReportFacade } from './report.facade';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity])],
    controllers: [ReportController],
    providers: [ReportFacade, ReportService, ReportRepository, UserRepository],
})
export class ReportModule {}
