import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setSwaggerConfig(app: NestExpressApplication) {
    const config = new DocumentBuilder()
        .setTitle('아파트 임장 보고서 API')
        .setDescription('아파트 임장 보고서 주요 API 문서입니다.')
        .setVersion('1.0.0')
        .addTag('swagger')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
