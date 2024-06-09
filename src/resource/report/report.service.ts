import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ReportService {
    constructor(
        private readonly reportRepo: ReportRepository,
        private readonly userRepo: UserRepository,
    ) {}

    async getReports() {
        return await this.reportRepo.findAll();
    }

    async getReport(id: number) {
        return await this.reportRepo.findById(id);
    }

    async postReport(createReportDto: CreateReportDto) {
        const user = await this.userRepo.findById(18);
        const createReport = this.reportRepo.create({
            ...createReportDto,
            user,
        });
        return await this.reportRepo.save(createReport);
    }

    async putReport(id: number, updateReportDto: UpdateReportDto) {
        const user = await this.userRepo.findById(18);
        return await this.reportRepo.save({
            id,
            ...updateReportDto,
            user,
        });
    }

    async deleteReport(id: number) {
        return await this.reportRepo.softDelete({ id });
    }
}
