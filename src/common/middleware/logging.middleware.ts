import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const path = req.originalUrl;
        console.time('Request-response time');
        console.log(`${path} From middleware!`);

        res.on('finish', () => console.timeEnd('Request-response time'));
        next();
    }
}
