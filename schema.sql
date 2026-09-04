-- RIDEEL PostgreSQL Database Schema Definitions

-- Users Table
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

-- Trips Table (Travelers)
CREATE TABLE IF NOT EXISTS trips (
  id VARCHAR(64) PRIMARY KEY,
  traveler_id VARCHAR(64) REFERENCES users(id),
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  origin_lat NUMERIC(10, 6),
  origin_lng NUMERIC(10, 6),
  destination_lat NUMERIC(10, 6),
  destination_lng NUMERIC(10, 6),
  travel_date DATE NOT NULL,
  departure_time VARCHAR(20),
  estimated_arrival VARCHAR(20),
  vehicle_id VARCHAR(64),
  capacity_kg NUMERIC(6, 2) NOT NULL,
  available_capacity_kg NUMERIC(6, 2) NOT NULL,
  max_weight_kg NUMERIC(6, 2) NOT NULL,
  pickup_preference VARCHAR(50),
  delivery_preference VARCHAR(50),
  price_per_kg NUMERIC(8, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'POSTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parcels Table (Senders)
CREATE TABLE IF NOT EXISTS parcels (
  id VARCHAR(64) PRIMARY KEY,
  sender_id VARCHAR(64) REFERENCES users(id),
  parcel_type VARCHAR(50) NOT NULL,
  description TEXT,
  weight_kg NUMERIC(6, 2) NOT NULL,
  length_cm NUMERIC(6, 2),
  width_cm NUMERIC(6, 2),
  height_cm NUMERIC(6, 2),
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  sender_address TEXT,
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_address TEXT NOT NULL,
  declared_value NUMERIC(10, 2) DEFAULT 0,
  is_fragile BOOLEAN DEFAULT FALSE,
  requires_refrigeration BOOLEAN DEFAULT FALSE,
  pickup_preference VARCHAR(50),
  delivery_preference VARCHAR(50),
  status VARCHAR(30) DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries Table (Escrow & State Machine)
CREATE TABLE IF NOT EXISTS deliveries (
  id VARCHAR(64) PRIMARY KEY,
  parcel_id VARCHAR(64) REFERENCES parcels(id),
  trip_id VARCHAR(64) REFERENCES trips(id),
  sender_id VARCHAR(64) REFERENCES users(id),
  traveler_id VARCHAR(64) REFERENCES users(id),
  pricing_reward NUMERIC(10, 2) NOT NULL,
  pricing_platform_fee NUMERIC(10, 2) NOT NULL,
  pricing_insurance_fee NUMERIC(10, 2) NOT NULL,
  pricing_total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(40) DEFAULT 'BOOKED',
  pickup_otp VARCHAR(6),
  delivery_otp VARCHAR(6),
  pickup_verified_at TIMESTAMP WITH TIME ZONE,
  delivered_verified_at TIMESTAMP WITH TIME ZONE,
  current_lat NUMERIC(10, 6),
  current_lng NUMERIC(10, 6),
  last_location_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments & Escrow Ledger Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  delivery_id VARCHAR(64) REFERENCES deliveries(id),
  payer_id VARCHAR(64) REFERENCES users(id),
  payee_id VARCHAR(64) REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  escrow_status VARCHAR(30) DEFAULT 'HELD',
  gateway_payment_id VARCHAR(100),
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
