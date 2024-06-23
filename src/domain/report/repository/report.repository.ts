import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { ReportEntity } from '../entity/report.entity';
import { getSkip } from '../../../common/common.function';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ReportEntity, dataSource.createEntityManager());
    }

    async findAll() {
        return await this.find({
            relations: {
                user: true,
            },
        });
    }

    async findById(id: number) {
        return await this.findOne({
            where: {
                id,
            },
            relations: {
                user: true,
            },
        });
    }

    async findAllPagination(
        { page, limit }: { page: number; limit: number },
        overrideFindOptions?: FindManyOptions<ReportEntity>,
    ) {
        const { skip, take } = getSkip(page, limit);
        return await this.findAndCount({
            skip,
            take,
            ...(overrideFindOptions && overrideFindOptions),
        });
    }
}
