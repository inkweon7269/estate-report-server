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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: TypeormConfig,
        }),
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
