import { query } from './database';

export async function seedDatabaseIfEmpty() {
  try {
    // 0. Ensure schema structure exists & columns are migrated
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255),
        phone VARCHAR(20) UNIQUE,
        email VARCHAR(255),
        profile_photo TEXT,
        city VARCHAR(100),
        rating NUMERIC(3, 2) DEFAULT 5.0,
        completed_deliveries INT DEFAULT 0,
        role TEXT[] DEFAULT ARRAY['sender', 'traveler'],
        active_mode VARCHAR(20) DEFAULT 'sender',
        account_status VARCHAR(20) DEFAULT 'active',
        is_kyc_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 5.0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_deliveries INT DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT[] DEFAULT ARRAY['sender', 'traveler'];
      ALTER TABLE users ADD COLUMN IF NOT EXISTS active_mode VARCHAR(20) DEFAULT 'sender';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_kyc_verified BOOLEAN DEFAULT FALSE;
    `);

    // Check users table count
    const usersCountRes = await query('SELECT COUNT(*) FROM users;');
    const count = parseInt(usersCountRes.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 Seeding initial real records into PostgreSQL database...');

      // 1. Seed Users (Using standard UUID format compatible with both UUID & VARCHAR columns)
      await query(`
        INSERT INTO users (id, full_name, phone, email, profile_photo, city, rating, completed_deliveries, role, active_mode, is_kyc_verified)
        VALUES 
        ('a0000000-0000-4000-a000-000000000001', 'Aarav Sharma', '9876543210', 'aarav@rideel.in', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Chennai', 4.95, 12, ARRAY['sender', 'traveler'], 'sender', TRUE),
        ('a0000000-0000-4000-a000-000000000002', 'Priya Reddy', '9876543211', 'priya@rideel.in', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', 'Vijayawada', 4.90, 48, ARRAY['traveler'], 'traveler', TRUE),
        ('a0000000-0000-4000-a000-000000000003', 'Arjun Kumar', '9876543212', 'arjun@rideel.in', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Bangalore', 4.85, 34, ARRAY['traveler'], 'traveler', TRUE)
        ON CONFLICT (phone) DO NOTHING;
      `);

      // 2. Seed Drivers
      await query(`
        INSERT INTO drivers (id, user_id, license_number, verification_status, rating)
        VALUES
        ('b0000000-0000-4000-a000-000000000001', 'a0000000-0000-4000-a000-000000000002', 'DL-AP-2024-998822', 'APPROVED', 4.90),
        ('b0000000-0000-4000-a000-000000000002', 'a0000000-0000-4000-a000-000000000003', 'DL-KA-2023-774411', 'APPROVED', 4.85)
        ON CONFLICT (id) DO NOTHING;
      `);

      // 3. Seed Vehicles
      await query(`
        INSERT INTO vehicles (id, driver_id, make_model, license_plate, capacity_kg)
        VALUES
        ('c0000000-0000-4000-a000-000000000001', 'b0000000-0000-4000-a000-000000000001', 'Hyundai Creta SUV', 'AP-16-CB-4490', 25.0),
        ('c0000000-0000-4000-a000-000000000002', 'b0000000-0000-4000-a000-000000000002', 'Honda City', 'KA-05-MH-8812', 20.0)
        ON CONFLICT (id) DO NOTHING;
      `);

      // 4. Seed Rides / Trips
      await query(`
        INSERT INTO rides (id, driver_id, origin, destination, travel_date, departure_time, available_capacity_kg, price_per_kg, status)
        VALUES
        ('d0000000-0000-4000-a000-000000000001', 'b0000000-0000-4000-a000-000000000001', 'Vijayawada', 'Hyderabad', CURRENT_DATE + INTERVAL '1 day', '08:30 AM', 18.5, 45.0, 'POSTED'),
        ('d0000000-0000-4000-a000-000000000002', 'b0000000-0000-4000-a000-000000000002', 'Chennai', 'Bangalore', CURRENT_DATE + INTERVAL '2 days', '10:00 AM', 12.0, 50.0, 'POSTED')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 5. Seed Bookings
      await query(`
        INSERT INTO bookings (id, ride_id, sender_id, weight_kg, total_price, pickup_otp, delivery_otp, status)
        VALUES
        ('e0000000-0000-4000-a000-000000000001', 'd0000000-0000-4000-a000-000000000001', 'a0000000-0000-4000-a000-000000000001', 2.5, 180.0, '482910', '920411', 'IN_TRANSIT'),
        ('e0000000-0000-4000-a000-000000000002', 'd0000000-0000-4000-a000-000000000002', 'a0000000-0000-4000-a000-000000000001', 1.0, 90.0, '319402', '840192', 'DELIVERED')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 6. Seed Notifications
      await query(`
        INSERT INTO notifications (id, user_id, title, message, is_read)
        VALUES
        ('f0000000-0000-4000-a000-000000000001', 'a0000000-0000-4000-a000-000000000001', 'Parcel RD399812 In Transit', 'Priya Reddy has picked up your parcel from Vijayawada.', FALSE),
        ('f0000000-0000-4000-a000-000000000002', 'a0000000-0000-4000-a000-000000000001', 'Parcel RD498412 Delivered', 'Arjun Kumar completed delivery to Bangalore.', TRUE),
        ('f0000000-0000-4000-a000-000000000003', 'a0000000-0000-4000-a000-000000000001', 'Welcome to Rideel!', 'Your account has been verified and active.', TRUE)
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log('✅ PostgreSQL database seeded successfully with real initial data!');
    }
  } catch (err: any) {
    console.error('Database seeding notice:', err.message);
  }
}

