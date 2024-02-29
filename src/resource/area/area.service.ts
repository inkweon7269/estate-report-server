import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area1Entity } from '@root/entities/area-1.entity';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { Area2Entity } from '@root/entities/area-2.entity';
import { Area3Entity } from '@root/entities/area-3.entity';
import { ApartEntity } from '@root/entities/apart.entity';
import { PaginateAreaDto } from '@root/resource/area/dtos/paginate-area.dto';
import { CommonService } from '@root/common/common.service';

@Injectable()
export class AreaService {
    constructor(
        @InjectRepository(Area1Entity)
        private readonly area1Repo: Repository<Area1Entity>,
        @InjectRepository(Area2Entity)
        private readonly area2Repo: Repository<Area2Entity>,
        @InjectRepository(Area3Entity)
        private readonly area3Repo: Repository<Area3Entity>,

        private readonly commonService: CommonService,
    ) {}

    async getA1All() {
        return await this.area1Repo.find({
            select: {
                id: true,
                name: true,
                code: true,
            },
        });
    }

    async getA2All(area1Id: number) {
        return await this.area2Repo.find({
            select: {
                id: true,
                name: true,
                code: true,
                area1Id: true,
            },
            where: {
                area1Id,
            },
        });
    }

    async getA3All(area2Id: number) {
        return await this.area3Repo.find({
            select: {
                id: true,
                name: true,
                code: true,
                area2Id: true,
            },
            where: {
                area2Id,
            },
        });
    }

    async getTestPaginate(dto: PaginateAreaDto) {
        return this.commonService.paginate(
            dto,
            this.area2Repo,
            {
                relations: ['area1', 'area3List'],
            },
            '',
        );
        /*if (dto.page) {
            return await this.getTestPagePagination(dto);
        } else {
            return await this.getTestCursorPagination(dto);
        }*/
    }

    async getTestPagePagination(query: PaginateAreaDto) {
        /**
         * data: Data[],
         * total: number,
         */
        const [areas, count] = await this.area2Repo.findAndCount({
            skip: query.take * (query.page - 1),
            take: query.take,
            order: {
                createAt: query.order__createAt,
            },
        });

        return {
            data: areas,
            total: count,
        };
    }

    async getTestCursorPagination(query: PaginateAreaDto) {
        const where: FindOptionsWhere<Area2Entity> = {};

        if (query.where__id__less_than) {
            where.id = LessThan(query.where__id__less_than);
        } else if (query.where__id__more_than) {
            where.id = MoreThan(query.where__id__more_than);
        }

        const areas = await this.area2Repo.find({
            where,
            take: query.take,
            order: {
                id: query.order__createAt,
            },
        });

        const lastItem = areas.length > 0 && areas.length === query.take ? areas[areas.length - 1] : null;
        const nextUrl = lastItem && new URL('http://localhost:8000/v1/area/test/cursor/pagination');

        if (nextUrl) {
            for (const key of Object.keys(query)) {
                if (query[key]) {
                    if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {
                        nextUrl.searchParams.append(key, query[key]);
                    }
                }
            }

            const key = query.order__createAt === 'ASC' ? 'where__id__more_than' : 'where__id__less_than';

            nextUrl.searchParams.append(key, lastItem.id.toString());
        }

        /**
         * Response
         *
         * data: Data[],
         * cursor: {
         *   after: 마지막 data의 ID
         * },
         * count: 응답한 데이터의 갯수
         * next: 다음 요청을 할 때 사용할 URL
         */

        return {
            data: areas,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: areas.length,
            next: nextUrl?.toString() ?? null,
        };
    }
}
