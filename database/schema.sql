-- RIDEEL PostgreSQL Database Schema Reference DDL
-- Existing Database Schema - Source of Truth

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
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

CREATE TABLE IF NOT EXISTS drivers (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  license_number VARCHAR(100),
  verification_status VARCHAR(30) DEFAULT 'APPROVED',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(64) PRIMARY KEY,
  driver_id VARCHAR(64) REFERENCES drivers(id),
  make_model VARCHAR(100),
  license_plate VARCHAR(50),
  capacity_kg NUMERIC(6, 2) DEFAULT 15.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rides (
  id VARCHAR(64) PRIMARY KEY,
  driver_id VARCHAR(64) REFERENCES drivers(id),
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  travel_date DATE NOT NULL,
  departure_time VARCHAR(20),
  available_capacity_kg NUMERIC(6, 2) NOT NULL,
  price_per_kg NUMERIC(8, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'POSTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  ride_id VARCHAR(64) REFERENCES rides(id),
  sender_id VARCHAR(64) REFERENCES users(id),
  weight_kg NUMERIC(6, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  pickup_otp VARCHAR(6),
  delivery_otp VARCHAR(6),
  status VARCHAR(30) DEFAULT 'CONFIRMED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  booking_id VARCHAR(64) REFERENCES bookings(id),
  payer_id VARCHAR(64) REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  escrow_status VARCHAR(30) DEFAULT 'HELD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  reviewer_id VARCHAR(64) REFERENCES users(id),
  reviewee_id VARCHAR(64) REFERENCES users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
