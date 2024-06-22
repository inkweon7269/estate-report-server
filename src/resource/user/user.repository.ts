import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async findAll() {
        return await this.find();
    }

    async findById(id: number) {
        return await this.findOne({
            where: {
                id,
            },
        });
    }

    async findByEmail(email: string) {
        return await this.findOne({
            where: {
                email,
            },
        });
    }

    async findByIdAndRefresh(id: number, refreshToken: string) {
        return await this.findOne({
            where: {
                id,
                refreshToken,
            },
        });
    }
}
