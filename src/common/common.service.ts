import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from '@root/common/dtos/base-pagination.dto';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { FILTER_MAPPER } from '@root/common/const/filter-mapper.const';
import { CommonEntity } from '@root/common/entities/common.entity';

@Injectable()
export class CommonService {
    async paginate<T extends CommonEntity>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T>,
        path: string,
    ) {
        if (dto.page) {
            return await this.pagePaginate(dto, repository, overrideFindOptions);
        } else {
            return await this.cursorPaginate(dto, repository, overrideFindOptions, path);
        }
    }

    private async pagePaginate<T extends CommonEntity>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T>,
    ) {
        const findOptions = this.composeFindOptions<T>(dto);

        const [data, count] = await repository.findAndCount({
            ...findOptions,
            ...overrideFindOptions,
        });

        return {
            data,
            total: count,
        };
    }

    private async cursorPaginate<T extends CommonEntity>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T>,
        path: string,
    ) {
        /**
         * where__likeCount__more_than
         * where__title__ilike
         */

        const findOptions = this.composeFindOptions<T>(dto);

        const results = await repository.find({
            ...findOptions,
            ...overrideFindOptions,
        });

        const lastItem = results.length > 0 && results.length === dto.take ? results[results.length - 1] : null;
        const nextUrl = lastItem && new URL('http://localhost:8000/v1/area/test/cursor/pagination');

        if (nextUrl) {
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {
                        nextUrl.searchParams.append(key, dto[key]);
                    }
                }
            }

            const key = dto.order__createAt === 'ASC' ? 'where__id__more_than' : 'where__id__less_than';

            nextUrl.searchParams.append(key, lastItem.id.toString());
        }

        return {
            data: results,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: results.length,
            next: nextUrl?.toString() ?? null,
        };
    }

    private composeFindOptions<T extends CommonEntity>(dto: BasePaginationDto): FindManyOptions<T> {
        /**
         * where,
         * order,
         * take,
         * skip -> page 기반일때만 반환
         */
        /**
         * DTO의 현재
         * - where__id_less_than
         * - order__createAt
         *
         * 1) where로 시작한다면 필터 로직을 적용한다.
         * 2) order로 시작한다면 정룔 로직을 적용한다,.
         * 3) 필터 로직을 적용한다면 '__' 기준으로 split했을 때 3개의 값으로 나뉘는지 2개의 값으로 나뉘는지 확인한다.
         *    3-1. 3개의 값으로 나뉜다면 FILTER_MAPPER에서 해당하는 aperator 함수를 찾아서 적용한다. ['where', 'id', 'more_than']
         *    3-2. 2개의 값으로 나뉜다면 정확한 값을 필터하는 것이기 때문에 operator 제공한다 ['where', 'id'].
         * 4) order의 경우 3-2 방법으로 적용한다.
         */

        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};

        for (const [key, value] of Object.entries(dto)) {
            // key -> where__id__less_than
            // value -> 1

            if (key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                };
            }

            if (key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseWhereFilter(key, value),
                };
            }
        }

        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null,
        };
    }

    private parseWhereFilter<T extends CommonEntity>(
        key: string,
        value: any,
    ): FindOptionsWhere<T> | FindOptionsOrder<T> {
        const options: FindOptionsWhere<T> = {};

        /**
         * __를 기준으로 나눴을 때
         */
        const split = key.split('__');

        if (split.length !== 2 && split.length !== 3) {
            throw new BadRequestException(
                `where 필터는 '__'로 split 했을 때 길이가 2 또는 3이어야 합니다. - 문제가 되는 키값 : ${key}`,
            );
        }

        /**
         * 길이가 2인 경우 where__id = 3
         * {
         *   where: {
         *     id : 3
         *   }
         * }
         */
        if (split.length === 2) {
            const [_, field] = split;
            /**
             * {
             *   id: 3,
             * }
             */
            options[field] = value;
        } else {
            /**
             * 길이가 3일 경우 Typeorm 유틸리티 적용이 필요한 경우다.
             *
             * where__id__more_than의 경우
             * where는 버려도 되고 두 번째 값은 필터할 키값이 되고 세번째 값은 typeorm 유틸리티가 된다.
             *
             * FILTER_MAPPER에 미리 정의해둔 값들로 filed 값에 FILTER_MAPPER에서 해당되는 utility를 가져온 후 값에 적용 해준다.
             */
            // ['where', 'id', 'more_than']
            const [_, field, operator] = split;

            /*
            // where__id__between = 3, 4
            // 만약에 split 대상 문자가 존재하지 않으면 길이가 무조건 1이다.
            const values = value.toString().split(',');
            if (operator === 'between') {
                options[field] = FILTER_MAPPER[operator](values[0], values[1]);
            } else {
                options[field] = FILTER_MAPPER[operator][value];
            }
            */
            if (operator === 'i_like') {
                options[field] = FILTER_MAPPER[operator](`%${value}%`);
            } else {
                options[field] = FILTER_MAPPER[operator](value);
            }
        }

        return options;
    }
}
