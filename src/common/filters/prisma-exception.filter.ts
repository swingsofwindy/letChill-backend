import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        switch (exception.code) {
            case 'P2002':
                statusCode = HttpStatus.CONFLICT;

                const targetField = exception.meta?.target;
                if (targetField && Array.isArray(targetField)) {
                    message = `${targetField[0]} already exists`;
                } else {
                    message = 'Unique constraint failed on a field';
                }
                break;

            case 'P2025':
                statusCode = HttpStatus.NOT_FOUND;
                message = 'Record not found';
                break;

            case 'P2003':
                statusCode = HttpStatus.BAD_REQUEST;
                message = `Foreign key constraint failed on the ${exception.meta?.field_name}`;
                break;

            default:
                console.error(exception);
                break;
        }

        response.status(statusCode).json({
            statusCode,
            error: message,
        });
    }
}
