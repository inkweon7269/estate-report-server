import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(AuthEntity, dataSource.createEntityManager());
    }

    async findByUserId(userId: number) {
        return await this.findOne({
            relations: {
                user: true,
            },
            where: {
                userId,
            },
        });
    }

    async findByEmail(email: string) {
        return await this.findOne({
            relations: {
                user: true,
            },
            where: {
                user: {
                    email,
                },
            },
        });
    }
}
