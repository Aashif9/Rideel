import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DbTestService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    /**
     * Verifies the PostgreSQL connection is live and lists existing tables.
     * SECURITY: Returns only non-sensitive metadata — no passwords, no connection strings.
     */
    async testConnection() {
        // Query the current database name and connected user (no password)
        const metaResult = await this.dataSource.query(
            'SELECT current_database() AS db_name, current_user AS db_user;',
        );

        // List all public tables — confirms existing schema is intact
        const tablesResult = await this.dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        const tableNames: string[] = tablesResult.map(
            (r: { table_name: string }) => r.table_name,
        );

        return {
            success: true,
            message: 'RIDEEL NestJS backend successfully connected to PostgreSQL!',
            connection: {
                database: metaResult[0]?.db_name,
                user: metaResult[0]?.db_user,
                // ⚠️  Host, port, and password are NEVER returned here
            },
            tables: tableNames,
            tableCount: tableNames.length,
            timestamp: new Date().toISOString(),
        };
    }
}
