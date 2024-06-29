import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationDto {
    @ApiProperty({ description: '조회할 page', default: 1 })
    @IsNumber()
    page: number = 1;

    @ApiProperty({ description: '최대 조회 건수', default: 20 })
    @IsNumber()
    limit: number = 20;
}
