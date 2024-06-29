import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationResponse } from '../dtos/output.dto';

@Injectable()
export class TransformInterceptor<T extends object> implements NestInterceptor<T, PaginationResponse<T> | T> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<PaginationResponse<T> | T> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((data: T) => {
                if (data instanceof Object && 'count' in data && 'list' in data) {
                    const { list, count } = data as { list: T[]; count: number }; // 올바른 구조로 타입 주장
                    const page = Number(request.query.page) || 1;
                    const limit = Number(request.query.limit) || 20;

                    return new PaginationResponse(list, count, page, limit);
                }

                return data;
            }),
        );
    }
}
