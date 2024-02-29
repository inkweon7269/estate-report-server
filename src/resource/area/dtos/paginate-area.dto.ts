import { BasePaginationDto } from '@root/common/dtos/base-pagination.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginateAreaDto extends BasePaginationDto {
    @IsNumber()
    @IsOptional()
    where__code__more_than: number;

    @IsString()
    @IsOptional()
    where__name__i_like: string;
}
