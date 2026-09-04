-- Migration: 001_create_delivery_locations.sql
-- Real-Time Live GPS Tracking Schema for RIDEEL

CREATE TABLE IF NOT EXISTS delivery_locations (
  id BIGSERIAL PRIMARY KEY,
  delivery_id VARCHAR(64) NOT NULL,
  traveler_id VARCHAR(64) NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  accuracy NUMERIC(8, 2),
  speed NUMERIC(8, 2),
  heading NUMERIC(6, 2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_locations_del_id ON delivery_locations(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_locations_rec_at ON delivery_locations(recorded_at);
