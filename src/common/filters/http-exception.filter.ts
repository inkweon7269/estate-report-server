import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { CommonLogger } from '../common.logger';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new CommonLogger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();

        if (exception instanceof HttpException) {
            const response = ctx.getResponse<Response>();
            const responseData = exception.getResponse() as Record<string, unknown>;
            const httpStatus = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
            const { code, message, ...rest } = responseData;
            response.status(httpStatus).json({ result: false, code: code || httpStatus, message, ...rest });
        }

        this.logger.requestError(request, exception);
        super.catch(exception, host);
    }
}
