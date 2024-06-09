import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFacade } from './auth.facade';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
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
    providers: [AuthService, AuthFacade],
})
export class AuthModule {}
