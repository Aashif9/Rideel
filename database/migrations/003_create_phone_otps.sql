-- Migration: Create phone_otps table
CREATE TABLE IF NOT EXISTS phone_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER DEFAULT 0 NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for rapid lookup by normalized phone number
CREATE INDEX IF NOT EXISTS idx_phone_otps_phone ON phone_otps(phone);

-- Index for searching active valid OTPs
CREATE INDEX IF NOT EXISTS idx_phone_otps_phone_expires ON phone_otps(phone, expires_at);
