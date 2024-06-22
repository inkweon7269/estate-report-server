import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class CommonLogger extends ConsoleLogger implements LoggerService {
    constructor(context: string) {
        super(context, {
            logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
            timestamp: true,
        });
    }

    requestError(request: any, exception: any, additionalMessage?: string): string {
        const logMessage = this.getRequestMsg(request);
        const errorMsg = this.getExceptionMsg(exception);
        const message = `${logMessage}\n${errorMsg}\n${additionalMessage}`;
        this.error(message);
        return message;
    }

    requestLog(request: any, additionalMessage?: string): string {
        const message = this.getRequestMsg(request) + (additionalMessage ? `\n${additionalMessage}` : '');
        this.log(message);
        return message;
    }

    private getRequestMsg(request: any): string {
        const { method, path, user, body, query } = request;
        const time = Date.now() - request.now;

        let consoleMessage = '';
        consoleMessage += `${method} ${path} time : ${time}ms\n`;
        consoleMessage += `user : ${JSON.stringify(user)}\n`;
        consoleMessage += `body : ${JSON.stringify(body)}\n`;
        consoleMessage += `query : ${JSON.stringify(query)}\n`;

        return consoleMessage;
    }

    private getExceptionMsg(exception: any): string {
        let errorMsg = ``;
        errorMsg += `exception name : ${exception.name}\n`;
        errorMsg += `exception message : ${exception.message}\n`;
        errorMsg += `exception stack : \n`;
        exception.stack.split('\n').forEach((stackMessage) => {
            errorMsg += `\t${stackMessage}\n`;
        });
        return errorMsg;
    }
}
