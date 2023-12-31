import { PickType } from '@nestjs/swagger';
import { UserEntity } from '@root/entities/user.entity';

export class CreateUserDto extends PickType(UserEntity, ['email', 'password']) {}

export class LoginUserDto extends CreateUserDto {}
