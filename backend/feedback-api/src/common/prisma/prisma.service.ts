import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  private readonly clientInstance: PrismaClient | null;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      this.logger.warn('DATABASE_URL is not set. Prisma client is disabled until the database is configured.');
      this.clientInstance = null;
      return;
    }

    const adapter = new PrismaPg(
      new Pool({
        connectionString: databaseUrl
      })
    );

    this.clientInstance = new PrismaClient({ adapter });
  }

  async onModuleDestroy() {
    await this.clientInstance?.$disconnect();
  }

  get client() {
    if (!this.clientInstance) {
      throw new Error('Prisma client is unavailable because DATABASE_URL is not configured.');
    }

    return this.clientInstance;
  }
}
