import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    /**
     * GET /api/health
     * Simple liveness check — returns service status and uptime.
     * Does NOT expose any database connection details or secrets.
     */
    @Get()
    check() {
        return {
            success: true,
            service: 'rideel-nestjs-backend',
            version: '2.0.0',
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: Math.round(process.uptime()),
        };
    }
}
