import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@root/entities/user.entity';
import { UserController } from '@root/resource/user/user.controller';
import { UserService } from '@root/resource/user/user.service';
import { AuthModule } from '@root/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { USERS_IMAGE_PATH } from '@root/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { LogMiddleware } from '@root/middleware/log.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        // 적용하고자 하는 미들웨어 추가
        consumer.apply(LogMiddleware).forRoutes({
            path: '*user*',
            method: RequestMethod.ALL,
        });
    }
}
