import { PickType } from '@nestjs/swagger';
import { UserEntity } from '@root/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto extends PickType(UserEntity, ['email', 'password']) {}

export class LoginUserDto extends CreateUserDto {}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
