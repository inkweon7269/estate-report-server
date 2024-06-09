import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

export function setSwaggerConfig(app: NestExpressApplication) {
    app.use(
        '/api',
        expressBasicAuth({
            challenge: true,
            users: {
                admin: '1234',
            },
        }),
    );

    const allDocumentOption = new DocumentBuilder()
        .setTitle('임장보고서 API')
        .setDescription('임장 보고서 API 보고서')
        .setVersion('1.0.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' }, 'Bearer')
        .build();

    const document = SwaggerModule.createDocument(app, allDocumentOption);

    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
