import { Injectable } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/report.dto';
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
            list,
            count,
        };
    }

    async postReport(userId: number, createReportDto: CreateReportDto) {
        const user = await this.userService.getProfile(userId);
        const report = await this.reportService.postReport(user, createReportDto);
        return ReportResponseDto.of(report);
    }
}
