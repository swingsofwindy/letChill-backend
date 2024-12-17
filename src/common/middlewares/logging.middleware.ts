// logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly loggerService: LoggerService) {}
    use(req: Request, res: Response, next: NextFunction) {
        this.loggerService.debug(`${req.method} ${req.url}`);

        console.log(`Request body: 🚚`);
        console.dir(req.body, { depth: null });
        console.log('Running...');

        next();
    }
}
