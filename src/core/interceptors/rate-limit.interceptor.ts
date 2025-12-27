import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../shared/cache/redis.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.route.path;

    const key = `rate_limit:${endpoint}:${ip}`;
    const current = await this.redisService.incr(key);

    if (current === 1) {
      await this.redisService.expire(key, 60); // 1 minute window
    }

    if (current > 100) {
      // 100 requests per minute
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    request.rateLimit = {
      remaining: Math.max(0, 100 - current),
      reset: await this.redisService.ttl(key),
    };

    return next.handle().pipe(
      tap(() => {
        // Add rate limit headers to response
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-RateLimit-Limit', '100');
        response.setHeader(
          'X-RateLimit-Remaining',
          request.rateLimit.remaining,
        );
        response.setHeader('X-RateLimit-Reset', request.rateLimit.reset);
      }),
    );
  }
}
