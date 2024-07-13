import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { ReportEntity } from '../entity/report.entity';
import { getSkip } from '../../../common/common.function';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ReportEntity, dataSource.createEntityManager());
    }

    async findAllPagination(
        userId: number,
        { page, limit }: { page: number; limit: number },
        overrideFindOptions?: FindManyOptions<ReportEntity>,
    ) {
        const { skip, take } = getSkip(page, limit);
        return await this.findAndCount({
            relations: {
                user: true,
            },
            where: {
                userId,
            },
            skip,
            take,
            order: {
                createdAt: 'DESC',
            },
            ...(overrideFindOptions && overrideFindOptions),
        });
    }

    async findById(userId: number, reportId: number) {
        return await this.findOne({
            relations: {
                user: true,
            },
            where: {
                id: reportId,
                userId,
            },
        });
    }
}
