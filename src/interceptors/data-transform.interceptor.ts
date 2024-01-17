import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs';

@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (Array.isArray(data)) {
                    return data.map((item) => this.transformDates(item));
                }
                return this.transformDates(data);
            }),
        );
    }

    private transformDates(data: any): any {
        const dateFields = ['createAt', 'updateAt'];

        for (const field of dateFields) {
            if (data[field]) {
                data[field] = dayjs(data[field]).format('YYYY-MM-DD HH:mm:ss');
            }
        }

        return data;
    }
}
