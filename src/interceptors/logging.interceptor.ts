import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { path, user, body, query } = request;

        const startTime = Date.now(); // API 요청 시작 시간

        return next.handle().pipe(
            tap(() => {
                const endTime = Date.now(); // API 요청 종료 시간
                const timeToTime = endTime - startTime; // 실행 시간 계산

                let consoleMessage = `<p>logging</p>`;
                consoleMessage += `<p>${request.method} ${path} time : ${timeToTime}ms</p>`;
                consoleMessage += `<p>user : ${JSON.stringify(user)}</p>`;
                consoleMessage += `<p>body : ${JSON.stringify(body)}</p>`;
                consoleMessage += `<p>query : ${JSON.stringify(query)}</p>`;
                consoleMessage += `<p>date : ${new Date()}\n</p>`;

                process.stdout.write(consoleMessage.replaceAll('<p>', '').replaceAll('</p>', '\n'));
            }),
        );
    }
}
