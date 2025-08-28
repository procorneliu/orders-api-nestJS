import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException ? (exception.getResponse() as any).message : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    // // Check if error is not already defined with another Exception helper
    // if (exception instanceof HttpException) {
    //   const status = exception.getStatus();
    //   return response.status(status).json(exception.getResponse());
    // }

    // // Here are handled all unhandled exceptions
    // response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //   statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //   timeStamp: new Date().toISOString(),
    //   path: request.url,
    // });
  }
}
