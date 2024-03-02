import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from '@root/configs/typeorm.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@root/interceptors/logging.interceptor';
import { AppService } from '@root/app.service';
import { AreaModule } from '@root/resource/area/area.module';
import { ApartModule } from '@root/resource/apart/apart.module';
import { ReportModule } from '@root/resource/report/report.module';
import { UserModule } from '@root/resource/user/user.module';
import { DateTransformInterceptor } from '@root/interceptors/data-transform.interceptor';
import { CommonModule } from '@root/common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from '@root/common/const/path.const';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        ServeStaticModule.forRoot({
            // http://localhost:8000/public/users/de0f0d6d-8b66-429a-b132-6dc912bd79d5.png
            // rootPath : 정적 파일들이 위치한 디렉토리의 절대 경로를 지정
            // serverRoot : 정적 파일들에 접근하기 위한 URL 경로를 지정
            rootPath: PUBLIC_FOLDER_PATH,
            serveRoot: '/public',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: TypeormConfig,
        }),
        CommonModule,
        AreaModule,
        ApartModule,
        ReportModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        // { provide: APP_INTERCEPTOR, useClass: DateTransformInterceptor },
    ],
})
export class AppModule {}
