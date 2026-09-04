-- Migration: 005_add_pricing_quote_to_match_requests.sql
-- Add shared traveler trip capacity & V2 price snapshot columns to match_requests

ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS parcel_weight_kg NUMERIC(6, 2) DEFAULT 1.0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS traveler_capacity_kg NUMERIC(6, 2) DEFAULT 5.0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS distance_km NUMERIC(8, 2);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS traveler_payout NUMERIC(10, 2);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10, 2);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS delivery_speed VARCHAR(50);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS delivery_speed_fee NUMERIC(10, 2);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS detour_distance_km NUMERIC(6, 2) DEFAULT 0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS detour_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS pickup_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS drop_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS insurance_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS sender_price NUMERIC(10, 2);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS estimated_delivery_time VARCHAR(100);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS pricing_version VARCHAR(20) DEFAULT '2.0';
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS pricing_breakdown JSONB;
