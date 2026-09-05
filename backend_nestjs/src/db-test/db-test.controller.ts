import { Controller, Get, InternalServerErrorException, Logger } from '@nestjs/common';
import { DbTestService } from './db-test.service';

@Controller('db-test')
export class DbTestController {
    private readonly logger = new Logger(DbTestController.name);

    constructor(private readonly dbTestService: DbTestService) { }

    /**
     * GET /api/db-test
     * Verifies PostgreSQL connectivity and lists existing tables.
     * Returns db name and user only — never returns password, host, or DATABASE_URL.
     */
    @Get()
    async test() {
        try {
            return await this.dbTestService.testConnection();
        } catch (error: any) {
            this.logger.error('PostgreSQL connection test failed', error?.message);
            throw new InternalServerErrorException({
                success: false,
                message: 'Failed to connect to PostgreSQL database.',
                error: error?.message || 'Unknown database connection error',
            });
        }
    }
}
