import { query } from './database';

export async function seedDatabaseIfEmpty() {
  try {
    // 0. Ensure schema structure exists & columns are migrated matching existing PostgreSQL users schema
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(20) UNIQUE,
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'passenger',
        is_active BOOLEAN DEFAULT TRUE,
        profile_photo TEXT,
        city VARCHAR(100),
        rating NUMERIC(3, 2) DEFAULT 5.0,
        completed_deliveries INT DEFAULT 0,
        active_mode VARCHAR(20) DEFAULT 'sender',
        is_kyc_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 5.0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_deliveries INT DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'passenger';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS active_mode VARCHAR(20) DEFAULT 'sender';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_kyc_verified BOOLEAN DEFAULT FALSE;
    `);

    // Check users table count
    const usersCountRes = await query('SELECT COUNT(*) FROM users;');
    const count = parseInt(usersCountRes.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 Schema structure verified. PostgreSQL database is clean & ready for real users!');
    }
  } catch (err: any) {
    console.error('Database schema initialization notice:', err.message);
  }
}
