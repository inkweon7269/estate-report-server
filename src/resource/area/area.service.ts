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
    }
}
