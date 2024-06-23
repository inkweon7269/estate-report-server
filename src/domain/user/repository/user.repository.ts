import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
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
}
