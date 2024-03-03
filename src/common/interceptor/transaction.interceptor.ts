import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { tap } from 'rxjs/operators';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) {}
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();

        const queryRunner = this.dataSource.createQueryRunner();

        req.queryRunner = queryRunner;

        await queryRunner.connect();
        await queryRunner.startTransaction();

        return next.handle().pipe(
            catchError(async (e) => {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();

                throw new InternalServerErrorException(e.message);
            }),
            tap(async (observable) => {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }),
        );
    }
}
