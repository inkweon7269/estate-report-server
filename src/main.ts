import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwaggerConfig } from './setting/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    initializeTransactionalContext();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.use(cookieParser());

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    setSwaggerConfig(app);
    await app.listen(8000);
}

bootstrap();
