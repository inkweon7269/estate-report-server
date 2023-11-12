import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
    @ApiProperty({
        description: '페이지',
        default: '1',
        required: true,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    page!: number;

    @ApiProperty({
        description: '페이지 당 보여지는 수',
        default: '30',
        required: true,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    limit!: number;
}
