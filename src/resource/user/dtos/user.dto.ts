import { PickType } from '@nestjs/swagger';
import { UserEntity } from '@root/entities/user.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from '@root/common/validation-message/string-validation.message';

export class CreateUserDto extends PickType(UserEntity, ['email', 'password']) {
    @IsOptional()
    @IsString({ message: stringValidationMessage })
    image?: string;
}

export class LoginUserDto extends CreateUserDto {}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
