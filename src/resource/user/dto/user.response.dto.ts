import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../domain/user/entity/user.entity';
import * as dayjs from 'dayjs';

export class UserResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    email: string;

    static of(user: UserEntity) {
        const dto = new this();
        dto.id = user.id;
        dto.createdAt = dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss');
        dto.email = user.email;

        return dto;
    }
}
