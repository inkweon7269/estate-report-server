import { FindManyOptions } from 'typeorm';
import { ReportEntity } from '@root/entities/report.entity';

export const DEFAULT_REPORT_FIND_OPTIONS: FindManyOptions<ReportEntity> = {
    relations: {
        images: true,
    },
};
