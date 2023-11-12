import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalServiceStrategy extends PassportStrategy(Strategy, 'local-service') {
    constructor(private authService: AuthService) {
        super({
            // 로그인시 사용되는 기본 프로퍼티 변경
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    // 함수명은 validate로 작성한다.
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateServiceUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
