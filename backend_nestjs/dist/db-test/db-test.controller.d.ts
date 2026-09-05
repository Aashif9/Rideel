import { DbTestService } from './db-test.service';
export declare class DbTestController {
    private readonly dbTestService;
    private readonly logger;
    constructor(dbTestService: DbTestService);
    test(): Promise<{
        success: boolean;
        message: string;
        connection: {
            database: any;
            user: any;
        };
        tables: string[];
        tableCount: number;
        timestamp: string;
    }>;
}
