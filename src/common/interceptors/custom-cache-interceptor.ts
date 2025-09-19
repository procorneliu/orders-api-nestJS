import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const endPointName = request.originalUrl.split('/')[1];

    // Interceptor works only for GET http request
    if (request.method !== 'GET') return;

    if (request.params?.id) {
      return `${endPointName}:${request.params.id}`;
    }

    return endPointName;

    // return super.trackBy(context);
  }
}
