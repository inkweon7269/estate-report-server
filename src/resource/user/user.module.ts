import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { UserController } from '@root/resource/user/user.controller';
import { UserService } from '@root/resource/user/user.service';
import { AuthModule } from '@root/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
