import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    let message =
      exception instanceof HttpException ? (exception.getResponse() as any).message : 'Internal server error';

    // when user roles don't match RolesGuard
    if (status === 403 && request.url.match(/users/)) {
      message = "You don't have enough permissions to perfom this action";
    }

    const stack = (exception as any).stack ?? undefined;

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack,
    });
  }
}
