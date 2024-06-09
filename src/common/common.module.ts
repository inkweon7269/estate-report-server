import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { JwtServiceStrategy } from './strategies/jwt-service.strategy';
import { JwtServiceAuthGuard } from './guards/jwt-service.guard';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../resource/user/user.module';

@Module({
    imports: [PassportModule.register({ session: false }), UserModule],
    providers: [
        LocalServiceStrategy,
        JwtServiceStrategy,
        { provide: APP_GUARD, useClass: JwtServiceAuthGuard },
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    ],
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}
