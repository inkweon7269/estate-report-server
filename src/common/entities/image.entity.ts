import { CommonEntity } from '@root/common/entities/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import { REPORTS_PUBLIC_IMAGE_PATH } from '@root/common/const/path.const';
import { ReportEntity } from '@root/entities/report.entity';

export enum ImageType {
    REPORT_IMAGE = 'Report',
    USER_IMAGE = 'User',
}

@Entity({ name: 'image' })
export class ImageEntity extends CommonEntity {
    @Column({
        default: 0,
    })
    @IsInt()
    @IsOptional()
    order: number;

    @Column({
        enum: ImageType,
    })
    @IsEnum(ImageType)
    @IsString()
    type: ImageType;

    @Column()
    @IsString()
    @Transform(({ value, obj }) => {
        if (obj.type === ImageType.REPORT_IMAGE) {
            return `/${join(REPORTS_PUBLIC_IMAGE_PATH, value)}`;
        } else {
            return value;
        }
    })
    path: string;

    @ManyToOne((type) => ReportEntity, (report) => report.images)
    report?: ReportEntity;
}
