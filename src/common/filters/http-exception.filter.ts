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

        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            if (typeof res === 'object' && (res as any).message) {
                const innerMessage = (res as any).message;
                message = Array.isArray(innerMessage) ? innerMessage.join(', ') : innerMessage;
            } else {
                message = exception.message;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        const errorResponse = {
            status: false,
            message: message,
        };

        response.status(status).json(errorResponse);

    }
}
