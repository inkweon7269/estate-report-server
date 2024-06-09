import { Injectable } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportResponseDto } from './dto/report.response.dto';

@Injectable()
export class ReportFacade {
    constructor(private readonly reportService: ReportService) {}

    async getReports() {
        const reports = await this.reportService.getReports();
        return reports.map((report) => ReportResponseDto.of(report));
    }

    async getReport(id: number) {
        const report = await this.reportService.getReport(id);
        return ReportResponseDto.of(report);
    }

    async postReport(createReportDto: CreateReportDto) {
        const report = await this.reportService.postReport(createReportDto);
        return ReportResponseDto.of(report);
    }

    async putReport(id: number, updateReportDto: UpdateReportDto) {
        const report = await this.reportService.putReport(id, updateReportDto);
        return ReportResponseDto.of(report);
    }

    async deleteReport(id: number) {
        return await this.reportService.deleteReport(id);
    }
}
