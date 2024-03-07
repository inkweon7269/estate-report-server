import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
    catch(exception: any, host: ArgumentsHost): void {
        const socket = host.switchToWs().getClient();

        socket.emit('exception', {
            data: exception.getResponse(),
        });
    }
}
