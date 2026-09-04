import { query } from './database';

export async function seedDatabaseIfEmpty() {
  try {
    // Check users table count
    const usersCountRes = await query('SELECT COUNT(*) FROM users;');
    const count = parseInt(usersCountRes.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 Seeding initial real records into PostgreSQL database...');

      // 1. Seed Users
      await query(`
        INSERT INTO users (id, full_name, phone, email, profile_photo, city, rating, completed_deliveries, role, active_mode, is_kyc_verified)
        VALUES 
        ('usr_aarav', 'Aarav Sharma', '9876543210', 'aarav@rideel.in', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Chennai', 4.95, 12, ARRAY['sender', 'traveler'], 'sender', TRUE),
        ('usr_priya', 'Priya Reddy', '9876543211', 'priya@rideel.in', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', 'Vijayawada', 4.90, 48, ARRAY['traveler'], 'traveler', TRUE),
        ('usr_arjun', 'Arjun Kumar', '9876543212', 'arjun@rideel.in', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Bangalore', 4.85, 34, ARRAY['traveler'], 'traveler', TRUE)
        ON CONFLICT (phone) DO NOTHING;
      `);

      // 2. Seed Drivers
      await query(`
        INSERT INTO drivers (id, user_id, license_number, verification_status, rating)
        VALUES
        ('drv_priya', 'usr_priya', 'DL-AP-2024-998822', 'APPROVED', 4.90),
        ('drv_arjun', 'usr_arjun', 'DL-KA-2023-774411', 'APPROVED', 4.85)
        ON CONFLICT (id) DO NOTHING;
      `);

      // 3. Seed Vehicles
      await query(`
        INSERT INTO vehicles (id, driver_id, make_model, license_plate, capacity_kg)
        VALUES
        ('veh_1', 'drv_priya', 'Hyundai Creta SUV', 'AP-16-CB-4490', 25.0),
        ('veh_2', 'drv_arjun', 'Honda City', 'KA-05-MH-8812', 20.0)
        ON CONFLICT (id) DO NOTHING;
      `);

      // 4. Seed Rides / Trips
      await query(`
        INSERT INTO rides (id, driver_id, origin, destination, travel_date, departure_time, available_capacity_kg, price_per_kg, status)
        VALUES
        ('ride_1', 'drv_priya', 'Vijayawada', 'Hyderabad', CURRENT_DATE + INTERVAL '1 day', '08:30 AM', 18.5, 45.0, 'POSTED'),
        ('ride_2', 'drv_arjun', 'Chennai', 'Bangalore', CURRENT_DATE + INTERVAL '2 days', '10:00 AM', 12.0, 50.0, 'POSTED')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 5. Seed Bookings
      await query(`
        INSERT INTO bookings (id, ride_id, sender_id, weight_kg, total_price, pickup_otp, delivery_otp, status)
        VALUES
        ('RD399812', 'ride_1', 'usr_aarav', 2.5, 180.0, '482910', '920411', 'IN_TRANSIT'),
        ('RD498412', 'ride_2', 'usr_aarav', 1.0, 90.0, '319402', '840192', 'DELIVERED')
        ON CONFLICT (id) DO NOTHING;
      `);

      // 6. Seed Notifications
      await query(`
        INSERT INTO notifications (id, user_id, title, message, is_read)
        VALUES
        ('notif_1', 'usr_aarav', 'Parcel RD399812 In Transit', 'Priya Reddy has picked up your parcel from Vijayawada.', FALSE),
        ('notif_2', 'usr_aarav', 'Parcel RD498412 Delivered', 'Arjun Kumar completed delivery to Bangalore.', TRUE),
        ('notif_3', 'usr_aarav', 'Welcome to Rideel!', 'Your account has been verified and active.', TRUE)
        ON CONFLICT (id) DO NOTHING;
      `);

      console.log('✅ PostgreSQL database seeded successfully with real initial data!');
    }
  } catch (err: any) {
    console.error('Database seeding check notice:', err.message);
  }
}
