import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwaggerConfig } from './configs/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    setSwaggerConfig(app);

    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
        }),
    );

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    await app.listen(8000);
}
bootstrap();
