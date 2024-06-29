import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
    @ApiProperty({ isArray: true, description: '반환되는 목록' })
    list: T[];

    @ApiProperty({ name: 'totalCount', description: '총 결과 갯수' })
    totalCount: number;

    @ApiProperty()
    count: number;

    @ApiProperty()
    totalPage: number;

    @ApiProperty()
    page: number;

    constructor(data: T[], totalCount: number, page: number, take: number) {
        this.list = data;
        this.totalCount = totalCount;
        this.count = data.length;
        this.totalPage = Math.ceil(totalCount / take);
        this.page = page;
    }
}
