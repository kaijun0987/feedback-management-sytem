import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma';
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

    const ssl = this.resolveSslConfig(databaseUrl);

    const adapter = new PrismaPg(
      new Pool({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
        ssl
      })
    );

    this.clientInstance = new PrismaClient({ adapter });
  }

  private resolveSslConfig(databaseUrl: string) {
    try {
      const url = new URL(databaseUrl);
      const sslMode = url.searchParams.get('sslmode');
      const host = url.hostname.toLowerCase();
      const isLocalHost = host === 'localhost' || host === '127.0.0.1';

      if (sslMode === 'disable' || isLocalHost) {
        return undefined;
      }

      // AWS RDS requires encrypted connections in many setups. We enable TLS
      // explicitly here instead of relying on the connection string parser.
      return {
        rejectUnauthorized: false
      };
    } catch {
      return {
        rejectUnauthorized: false
      };
    }
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
