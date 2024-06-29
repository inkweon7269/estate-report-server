import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../../domain/report/repository/report.repository';
import { CreateReportDto } from './dto/report.dto';
import { UserEntity } from '../../domain/user/entity/user.entity';
import { PaginationDto } from '../../common/dtos/input.dto';

@Injectable()
export class ReportService {
    constructor(private readonly reportRepo: ReportRepository) {}

    async getReports(userId: number, paginationDto: PaginationDto) {
        return await this.reportRepo.findAllPagination(userId, paginationDto);
    }

    async postReport(user: UserEntity, createReportDto: CreateReportDto) {
        const createReport = this.reportRepo.create({
            ...createReportDto,
            user,
        });
        return await this.reportRepo.save(createReport);
    }
}
