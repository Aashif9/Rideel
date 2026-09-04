-- Migration 001: Create Users Table
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
