import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ReportService } from '@root/resource/report/report.service';
import { RolesEnum } from '@root/common/const/roles.const';
import { UserEntity } from '@root/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class IsReportMineOrAdminGuard implements CanActivate {
    constructor(private readonly reportService: ReportService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request & { user: UserEntity };

        const { user } = req;

        if (!user) {
            throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
        }

        /**
         * Admin일 경우 그냥 패스
         */
        /*
        if (user.role === RolesEnum) {
            return true;
        }
        */

        const reportId = req.params.reportId;

        if (!reportId) {
            throw new BadRequestException('보고서 아이디가 파라미터로 제공되어야 합니다.');
        }

        const report = await this.reportService.findByReportId({ reportId: parseInt(reportId), userId: user.id });

        if (!report) {
            throw new BadRequestException('보고서가 존재하지 않습니다.');
        }

        return true;
    }
}
