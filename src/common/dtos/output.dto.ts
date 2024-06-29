import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
    @ApiProperty({ isArray: true, description: '반환되는 목록' })
    list: T[];

    @ApiProperty({ name: 'totalCount', description: '총 결과 갯수' })
    totalCount: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPage: number;

    @ApiProperty()
    page: number;

    constructor(data: T[], totalCount: number, page: number, limit: number) {
        this.list = data;
        this.totalCount = totalCount;
        this.limit = limit;
        this.totalPage = Math.ceil(totalCount / limit);
        this.page = page;
    }
}
