import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonLogger } from '../common.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new CommonLogger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe(
            tap(() => {
                this.logger.requestLog(request);
            }),
        );
    }
}
