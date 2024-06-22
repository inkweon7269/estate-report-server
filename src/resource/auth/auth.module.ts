import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFacade } from './auth.facade';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { JwtServiceStrategy } from './strategies/jwt-service.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtServiceAuthGuard } from './guards/jwt-service.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({ session: false }),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: 'VMiEc4e6cfadfcvbret2345rasdgadsfg23qf',
                    signOptions: {
                        expiresIn: '1800000',
                    },
                };
            },
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        LocalServiceStrategy,
        JwtServiceStrategy,
        JwtRefreshStrategy,
        JwtRefreshGuard,
        AuthService,
        AuthFacade,
        { provide: APP_GUARD, useClass: JwtServiceAuthGuard },
    ],
})
export class AuthModule {}
