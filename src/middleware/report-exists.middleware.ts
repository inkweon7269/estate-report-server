import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ReportService } from '@root/resource/report/report.service';

@Injectable()
export class ReportExistsMiddleware implements NestMiddleware {
    constructor(private readonly reportService: ReportService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const reportId = req.params.reportId;

        if (!reportId) {
            throw new BadRequestException('보고서 아이디 파라미터는 필수입니다.');
        }

        const exists = await this.reportService.checkReportExistsById(Number(reportId));

        if (!exists) {
            throw new BadRequestException('보고서가 존재하지 않습니다.');
        }

        next();
    }
}
