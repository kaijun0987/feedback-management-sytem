import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiResponseInterceptor } from './common/http/api-response.interceptor';
import { HttpExceptionFilter } from './common/http/http-exception.filter';

function getAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) {
    return configuredOrigins;
  }

  const defaultOrigins = ['https://kaijun-feedback-system.fipdev.com'];

  if (process.env.NODE_ENV !== 'production') {
    defaultOrigins.push(
      'http://localhost:3000',
      'http://localhost:4173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4173',
      'http://127.0.0.1:5173'
    );
  }

  return defaultOrigins;
}

async function bootstrap() {
  const allowedOrigins = getAllowedOrigins();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS.`), false);
      },
      credentials: true
    }
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
}

bootstrap();
