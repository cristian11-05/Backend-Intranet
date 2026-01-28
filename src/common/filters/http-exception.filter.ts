import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? (exception.getResponse() as any).message || exception.message
                : 'Internal server error';

        const errorResponse = {
            timestamp: new Date().toISOString(),
            status: status,
            error: exception instanceof HttpException ? exception.name : 'Error',
            message: exception instanceof Error ? exception.message : (Array.isArray(message) ? message.join(', ') : message),
            path: request.url,
            stack: exception instanceof Error ? exception.stack : undefined,
            rawException: exception,
        };

        response.status(status).json(errorResponse);
    }
}
