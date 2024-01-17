import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartEntity } from '@root/entities/apart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApartService {
    constructor(
        @InjectRepository(ApartEntity)
        private readonly apartRepo: Repository<ApartEntity>,
    ) {}

    async getApartAll(area3Id: number) {
        return await this.apartRepo.find({
            where: {
                area3Id,
            },
        });
    }

    async findById(id: number) {
        return await this.apartRepo.findOneBy({
            id,
        });
    }
}
