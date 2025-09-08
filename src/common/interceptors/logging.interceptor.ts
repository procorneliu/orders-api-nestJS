import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    // No output for DELETE Http request
    if (req.method === 'DELETE') {
      return next.handle();
    }

    // adding status: 'success' to any successful responses
    return next.handle().pipe(
      map((data) => {
        // if not data, just go to next
        if (!data) return next.handle();

        if (Array.isArray(data.data) && data.data.length) {
          return {
            status: 'success',
            ...data,
          };
        } else {
          return {
            status: 'success',
            data,
          };
        }
      }),
    );
  }
}
