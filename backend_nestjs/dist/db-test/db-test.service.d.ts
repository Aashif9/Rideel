import { DataSource } from 'typeorm';
export declare class DbTestService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    testConnection(): Promise<{
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
