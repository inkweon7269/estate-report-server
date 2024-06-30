import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../../domain/report/repository/report.repository';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { UserEntity } from '../../domain/user/entity/user.entity';
import { PaginationDto } from '../../common/dtos/input.dto';

@Injectable()
export class ReportService {
    constructor(private readonly reportRepo: ReportRepository) {}

    async getReports(userId: number, paginationDto: PaginationDto) {
        return await this.reportRepo.findAllPagination(userId, paginationDto);
    }

    async getReport(userId: number, reportId: number) {
        const report = await this.reportRepo.findById(userId, reportId);

        if (!report) {
            throw new NotFoundException(`존재하지 않는 보고서입니다.`);
        }

        return report;
    }

    async postReport(user: UserEntity, createReportDto: CreateReportDto) {
        const createReport = this.reportRepo.create({
            ...createReportDto,
            user,
        });
        return await this.reportRepo.save(createReport);
    }

    async deleteReport(reportId: number) {
        return await this.reportRepo.softDelete({ id: reportId });
    }

    async putReport(reportId: number, updateReportDto: UpdateReportDto) {
        return await this.reportRepo.update(reportId, updateReportDto);
    }
}
