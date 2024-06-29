import { Injectable } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/report.dto';
import { ReportResponseDto } from './dto/report.response.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ReportFacade {
    constructor(
        private readonly reportService: ReportService,
        private readonly userService: UserService,
    ) {}

    async postReport(userId, createReportDto: CreateReportDto) {
        const user = await this.userService.getProfile(userId);
        const report = await this.reportService.postReport(user, createReportDto);
        return ReportResponseDto.of(report);
    }
}
