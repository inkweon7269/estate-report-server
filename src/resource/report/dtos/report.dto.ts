import { ApiProperty, PickType } from '@nestjs/swagger';
import { ReportEntity } from '@root/entities/report.entity';
import { PaginationDto } from '@root/common/dtos/pagination.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateReportDto extends PickType(ReportEntity, [
    'apartId',
    'space',
    'middle',
    'elementary',
    'kindergarten',
    'barrier',
    'hill',
    'layout',
    'distance',
    'sound',
    'underground',
    'parking',
    'clean',
    'playground',
    'store',
    'atm',
    'memo',
]) {}

export class UpdateReportDto extends PickType(ReportEntity, [
    'space',
    'middle',
    'elementary',
    'kindergarten',
    'barrier',
    'hill',
    'layout',
    'distance',
    'sound',
    'underground',
    'parking',
    'clean',
    'playground',
    'store',
    'atm',
    'memo',
]) {}

export class ReportPaginationDto extends PaginationDto {
    @ApiProperty({
        description: '즐겨찾기 보고서 조회',
        default: false,
        required: false,
    })
    @IsOptional()
    @Transform((value) => {
        return value?.obj?.isLike === 'true' ? true : false;
    })
    @IsBoolean()
    isLike?: boolean;
}
