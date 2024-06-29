import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../../../resource/auth/dto/auth.dto';
import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async findById(id: number) {
        return await this.findOne({
            relations: {
                auth: true,
            },
            where: {
                id,
            },
        });
    }

    async findByEmail(email: string) {
        return await this.findOne({
            relations: {
                auth: true,
            },
            where: {
                email,
            },
        });
    }

    async createUser(createUserDto: CreateUserDto) {
        const auth = new AuthEntity();
        const user = new UserEntity();

        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.auth = auth;

        return await this.save(user);
    }
}
