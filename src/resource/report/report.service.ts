import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '@root/entities/report.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@root/common/dtos/pagination.dto';
import { calcListTotalCount, getSkip } from '@root/common/common.function';
import {
    CreateLikeDto,
    CreateReportDto,
    ReportPaginationDto,
    UpdateReportDto,
} from '@root/resource/report/dtos/report.dto';
import { ReportUserBridgeEntity } from '@root/entities/report-user-bridge.entity';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly reportRepo: Repository<ReportEntity>,
        @InjectRepository(ReportUserBridgeEntity)
        private readonly reportUserBridgeRepo: Repository<ReportUserBridgeEntity>,
    ) {}

    async getReports(userId: number, { page, limit, isLike }: ReportPaginationDto) {
        const { skip, take } = getSkip(page, limit);
        const [list, count] = await this.reportRepo.findAndCount({
            relations: {
                apart: {
                    area3: {
                        area2: {
                            area1: true,
                        },
                    },
                },
                reportUserBridge: true,
            },
            where: {
                userId,
                ...(isLike && {
                    reportUserBridge: {
                        userId,
                    },
                }),
            },
            skip,
            take,
            order: {
                createAt: 'DESC',
            },
        });

        return {
            list: list?.map((item) => ({
                id: item.id,
                totalScore: this.calcScore(item),
                area1: {
                    name: item.apart.area3.area2.area1,
                },
                area2: {
                    name: item.apart.area3.area2.name,
                },
                area3: {
                    name: item.apart.area3.name,
                },
                apart: {
                    year: item.apart.year,
                    type: item.apart.type,
                    name: item.apart.name,
                    corridorType: item.apart.corridorType,
                    heatType: item.apart.heatType,
                    address1: item.apart.address1,
                    address2: item.apart.address2,
                },
                isLike: item.reportUserBridge.some((item) => item.userId === userId),
                likeList: item.reportUserBridge,
            })),
            page,
            ...calcListTotalCount(count, Number(limit)),
        };
    }

    async getReport(id: number) {
        const result = await this.reportRepo.findOne({
            relations: {
                apart: {
                    area3: {
                        area2: {
                            area1: true,
                        },
                    },
                },
                reportUserBridge: true,
            },
            where: {
                id,
            },
        });

        return {
            ...result,
            apart: {
                year: result.apart.year,
                type: result.apart.type,
                name: result.apart.name,
                corridorType: result.apart.corridorType,
                heatType: result.apart.heatType,
                address1: result.apart.address1,
                address2: result.apart.address2,
            },
            totalScore: this.calcScore(result),
            isLike: result.reportUserBridge.some((item) => item.userId === result.userId),
            likeList: result.reportUserBridge,
        };
    }

    async createReport(userId: number, createReportDto: CreateReportDto) {
        const createReport = this.reportRepo.create({
            userId,
            ...createReportDto,
        });
        return await this.reportRepo.save(createReport);
    }

    async updateReport(id: number, updateReportDto: UpdateReportDto) {
        return await this.reportRepo.save({
            id,
            ...updateReportDto,
        });
    }

    async deleteReport({ userId, reportId }: { userId: number; reportId: number }) {
        const result = await this.reportRepo.softDelete({
            id: reportId,
        });

        const isDeleting = result.affected ? true : false;

        if (isDeleting) {
            await this.reportUserBridgeRepo.delete({ userId, reportId });
        }

        return isDeleting;
    }

    // 즐겨찾기 추가
    async createLike({ userId, reportId }: { userId: number; reportId: number }) {
        return this.reportUserBridgeRepo.save({ userId, reportId });
    }

    // 즐겨찾기 삭제
    async deleteLike({ userId, reportId }: { userId: number; reportId: number }) {
        const result = await this.reportUserBridgeRepo.delete({ userId, reportId });
        return result.affected ? true : false;
    }

    async findByReportId({ id, userId }: { id: number; userId: number }) {
        return await this.reportRepo.findOneBy({
            id,
            userId,
        });
    }

    async findByApartId({ userId, apartId }: { userId: number; apartId: number }) {
        return await this.reportRepo.findOneBy({
            userId,
            apartId,
        });
    }

    async findByLike({ userId, reportId }: { userId: number; reportId: number }) {
        return await this.reportUserBridgeRepo.findOneBy({
            userId,
            reportId,
        });
    }

    calcScore(report) {
        const {
            atm,
            store,
            playground,
            clean,
            parking,
            underground,
            sound,
            distance,
            layout,
            hill,
            barrier,
            kindergarten,
            elementary,
            middle,
            space,
        } = report;

        return (
            atm +
            store +
            playground +
            clean +
            parking +
            underground +
            sound +
            distance +
            layout +
            hill +
            barrier +
            kindergarten +
            elementary +
            middle +
            space
        );
    }
}
