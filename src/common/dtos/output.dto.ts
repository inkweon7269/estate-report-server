import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
    @ApiProperty({ isArray: true, description: '반환되는 목록' })
    list: T[];

    @ApiProperty({ description: '전체 데이터 개수' })
    totalCount: number;

    @ApiProperty({ description: '전체 페이지' })
    totalPage: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    constructor(data: T[], totalCount: number, page: number, limit: number) {
        this.list = data;
        this.totalCount = totalCount;
        this.totalPage = Math.ceil(totalCount / limit);
        this.page = page;
        this.limit = limit;
    }
}
