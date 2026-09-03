-- Migration 001: Create Users Table
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
