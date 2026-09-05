import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { DbTestModule } from './db-test/db-test.module';

@Module({
  imports: [
    // ─── Configuration ───────────────────────────────────────────────────────
    // Loads .env file and makes ConfigService available globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── Database ─────────────────────────────────────────────────────────────
    // TypeORM connected to existing PostgreSQL "rideel" database.
    // CRITICAL: synchronize: false — TypeORM will NEVER auto-modify the schema.
    // All schema changes must go through explicit migrations in database/migrations/.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const nodeEnv = config.get<string>('NODE_ENV', 'development');
        const isSecureConnection =
          nodeEnv === 'production' ||
          (databaseUrl?.includes('supabase') ?? false) ||
          (databaseUrl?.includes('neon') ?? false);

        return {
          type: 'postgres',
          url: databaseUrl,
          // TypeORM entities — loaded from all modules
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // ⚠️  NEVER set to true — protects existing production tables
          synchronize: false,
          // Use migrations for schema changes
          migrationsRun: false,
          migrations: [__dirname + '/../database/migrations/*.sql'],
          // Logging in development for observability
          logging: nodeEnv === 'development' ? ['query', 'error'] : ['error'],
          ssl: isSecureConnection ? { rejectUnauthorized: false } : undefined,
        };
      },
    }),

    // ─── Feature Modules ──────────────────────────────────────────────────────
    HealthModule,
    DbTestModule,
  ],
})
export class AppModule { }
