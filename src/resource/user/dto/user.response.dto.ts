import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../domain/user/entity/user.entity';

export class UserResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    email: string;

    static of(user: UserEntity) {
        const dto = new this();
        dto.id = user.id;
        dto.createdAt = user.createdAt;
        dto.email = user.email;

        return dto;
    }
}
