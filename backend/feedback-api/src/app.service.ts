import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  getAppHealth() {
    const timestamp = new Date().toISOString();

    return {
      status: 'ok',
      service: 'feedback-api',
      app: 'ok',
      timestamp
    };
  }

  async getDatabaseHealth() {
    const timestamp = new Date().toISOString();

    try {
      await this.prismaService.client.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        service: 'feedback-api',
        database: 'ok',
        timestamp
      };
    } catch (error) {
      this.logger.error('Health check failed because the database is unavailable.', error);

      throw new ServiceUnavailableException({
        status: 'error',
        service: 'feedback-api',
        database: 'unavailable',
        timestamp
      });
    }
  }
}
