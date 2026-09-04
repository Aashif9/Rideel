-- Migration: 004_create_match_requests.sql
-- Create match_requests table for Sender <-> Traveler request & approval workflow

CREATE TABLE IF NOT EXISTS match_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id VARCHAR(255) NOT NULL,
    trip_id VARCHAR(255) NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_score NUMERIC(5, 2) DEFAULT 95.0,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL, -- PENDING, ACCEPTED, REJECTED, EXPIRED
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for fast query lookup
CREATE INDEX IF NOT EXISTS idx_match_requests_traveler_id ON match_requests(traveler_id);
CREATE INDEX IF NOT EXISTS idx_match_requests_sender_id ON match_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_match_requests_status ON match_requests(status);
