import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { JwtServiceStrategy } from '@root/auth/strategies/jwt-service.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ session: false }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('SECRET_KEY'),
                    signOptions: { expiresIn: '1y' },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, LocalServiceStrategy, JwtServiceStrategy],
    exports: [AuthService],
})
export class AuthModule {}
