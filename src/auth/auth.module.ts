import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { JwtServiceStrategy } from '@root/auth/strategies/jwt-service.strategy';
import { JwtRefreshStrategy } from '@root/auth/strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from '@root/auth/guards/jwt-refresh.guard';
import { ENV_JWT_ACCESS_EXPIRATION_TIME, ENV_JWT_ACCESS_SECRET } from '@root/common/const/env-keys.const';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ session: false }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get(ENV_JWT_ACCESS_SECRET),
                    signOptions: {
                        expiresIn: configService.get(ENV_JWT_ACCESS_EXPIRATION_TIME),
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, LocalServiceStrategy, JwtServiceStrategy, JwtRefreshStrategy, JwtRefreshGuard],
    exports: [AuthService],
})
export class AuthModule {}
