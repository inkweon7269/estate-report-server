import { Injectable } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportResponseDto } from './dto/report.response.dto';
import { UserService } from '../user/user.service';
import { PaginationDto } from '../../common/dtos/input.dto';

@Injectable()
export class ReportFacade {
    constructor(
        private readonly reportService: ReportService,
        private readonly userService: UserService,
    ) {}

    async getReports(userId: number, paginationDto: PaginationDto) {
        await this.userService.getProfile(userId);
        const [list, count] = await this.reportService.getReports(userId, paginationDto);

        return {
            list: list.map((item) => ReportResponseDto.of(item)),
            count,
        };
    }

    async getReport(userId: number, reportId: number) {
        const report = await this.reportService.getReport(userId, reportId);

        return ReportResponseDto.of(report);
    }

    async postReport(userId: number, createReportDto: CreateReportDto) {
        const user = await this.userService.getProfile(userId);
        const report = await this.reportService.postReport(user, createReportDto);
        return ReportResponseDto.of(report);
    }

    async deleteReport(userId: number, reportId: number) {
        await this.reportService.getReport(userId, reportId);
        const result = await this.reportService.deleteReport(reportId);

        return result.affected === 1 ? true : false;
    }

    async putReport(userId: number, reportId: number, updateReportDto: UpdateReportDto) {
        await this.reportService.getReport(userId, reportId);
        const result = await this.reportService.putReport(reportId, updateReportDto);

        return result.affected === 1 ? true : false;
    }
}
