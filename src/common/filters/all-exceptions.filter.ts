import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, Logger } from '@nestjs/common';

import type { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    async catch(exception: HttpException, host: ArgumentsHost) {
        this.logger.error(exception.getResponse());
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = exception.getStatus();

        const responseException = exception.getResponse() as any;
        let message = responseException?.message || exception.message;
        if (!statusCode) {
            statusCode = 400;
            message = message;
        }
        let error;
        if (statusCode >= 400) {
            error = message;
            message = null;
            // Write error to file
        }
        response
            .status(statusCode)
            .json({ statusCode, message, data: null, error });
    }
}
