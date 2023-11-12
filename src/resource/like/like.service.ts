import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from '@root/entities/like.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@root/common/dtos/pagination.dto';
import { calcListTotalCount, getSkip } from '@root/common/common.function';
import { CreateLikeDto } from '@root/resource/like/dtos/like.dto';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(LikeEntity)
        private readonly likeRepo: Repository<LikeEntity>,
    ) {}

    async createLike(userId: number, createLikeDto: CreateLikeDto) {
        const createLike = this.likeRepo.create({
            userId,
            ...createLikeDto,
        });

        return await this.likeRepo.save(createLike);
    }

    async deleteLike(id: number) {
        const result = await this.likeRepo.softDelete(id);
        return result.affected ? true : false;
    }

    async findByReportId({ userId, reportId }: { userId: number; reportId: number }) {
        return await this.likeRepo.findOneBy({
            userId,
            reportId,
        });
    }

    async findByLikeId({ userId, reportId }: { userId: number; reportId: number }) {
        return await this.likeRepo.findOneBy({
            userId,
            reportId,
        });
    }
}
