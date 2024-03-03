import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        /**
         * 요청이 들어올 때 REQ 요청이 들어온 타임 스탬프를 찍는다.
         * [REQ] {요청 path} {요청 시간}
         *
         * 응답할 때 다시 타임스탬프를 찍는다.
         * [RES] {요청 path} {응답 시간} {얼마나 걸렸ㄲ는지 ms}
         */
        const now = new Date();

        const req = context.switchToHttp().getRequest();
        const path = req.originalUrl;

        console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

        // return next.hanlde()을 실행하는 순간 라우트의 로직이 전부 실행되고 응답이 반환된다.
        return next.handle().pipe(
            tap((observable) => {
                console.log(
                    `[RES] ${path} ${new Date().toLocaleString('kr')} ${
                        new Date().getMilliseconds() - now.getMilliseconds()
                    }ms`,
                );
            }),
            /*map((observable) => {
                return {
                    message: '응답이 변경되었습니다.',
                    response: observable,
                };
            }),*/
        );
    }
}
