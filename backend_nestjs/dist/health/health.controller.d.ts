export declare class HealthController {
    check(): {
        success: boolean;
        service: string;
        version: string;
        status: string;
        timestamp: string;
        uptime: number;
    };
}
