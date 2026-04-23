import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message = this.getMessage(payload, exception.message);

      response.status(status).json({
        code: String(status),
        msg: message,
        data: null
      });

      return;
    }

    this.logger.error(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: String(HttpStatus.INTERNAL_SERVER_ERROR),
      msg: 'Internal server error',
      data: null
    });
  }

  private getMessage(payload: string | object, fallback: string) {
    if (typeof payload === 'string') {
      return payload;
    }

    if ('message' in payload) {
      const message = payload.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return fallback;
  }
}
