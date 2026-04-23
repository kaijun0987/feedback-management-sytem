import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ApiSuccessResponse<T> {
  code: string;
  msg: string;
  data: T;
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        code: '0000',
        msg: 'success',
        data
      }))
    );
  }
}
