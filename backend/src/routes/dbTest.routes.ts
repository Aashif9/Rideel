import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

router.get('/db-test', async (req: Request, res: Response) => {
  try {
    // Query 1: Database name and user
    const dbInfoResult = await query('SELECT current_database(), current_user;');
    const currentDatabase = dbInfoResult.rows[0]?.current_database;
    const currentUser = dbInfoResult.rows[0]?.current_user;

    // Query 2: Existing public tables
    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tableNames = tablesResult.rows.map((r: { table_name: string }) => r.table_name);

    res.json({
      success: true,
      message: 'Successfully connected to PostgreSQL database from Rideel backend!',
      connection: {
        database: currentDatabase,
        user: currentUser,
      },
      tables: tableNames,
      tableCount: tableNames.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('PostgreSQL Backend Connection Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to PostgreSQL database.',
      error: error.message || 'Unknown database connection error',
    });
  }
});

export default router;
