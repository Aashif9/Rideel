/**
 * RIDEEL Pricing Engine Configuration V2
 * Centralized, configurable initial market values in integer PAISE (1 INR = 100 Paise)
 * Shared Traveler Capacity Model & Distance x Weight Payout Matrix
 */

export interface PayoutMatrixRow {
  minKm: number;
  maxKm: number;
  w500g: number; // 0.5 kg payout in paise
  w1kg: number;  // 1.0 kg payout in paise
  w2kg: number;  // 2.0 kg payout in paise
  w3kg: number;  // 3.0 kg payout in paise
  w5kg: number;  // 5.0 kg payout in paise
  perKmAbove1200Paise?: number;
}

/**
 * Traveler Payout Matrix (Values in Integer PAISE)
 */
export const PAYOUT_MATRIX: PayoutMatrixRow[] = [
  { minKm: 0, maxKm: 50, w500g: 5000, w1kg: 7000, w2kg: 11000, w3kg: 14000, w5kg: 19000 },
  { minKm: 50, maxKm: 100, w500g: 6000, w1kg: 8500, w2kg: 13000, w3kg: 16500, w5kg: 22000 },
  { minKm: 100, maxKm: 200, w500g: 7500, w1kg: 11000, w2kg: 17000, w3kg: 22000, w5kg: 29000 },
  { minKm: 200, maxKm: 300, w500g: 9000, w1kg: 13500, w2kg: 21000, w3kg: 27000, w5kg: 35000 },
  { minKm: 300, maxKm: 400, w500g: 10500, w1kg: 15500, w2kg: 24000, w3kg: 31000, w5kg: 40000 },
  { minKm: 400, maxKm: 500, w500g: 11500, w1kg: 17500, w2kg: 27500, w3kg: 35000, w5kg: 45000 },
  { minKm: 500, maxKm: 700, w500g: 13000, w1kg: 19500, w2kg: 30500, w3kg: 39000, w5kg: 50000 },
  { minKm: 700, maxKm: 900, w500g: 15000, w1kg: 22500, w2kg: 35000, w3kg: 45000, w5kg: 57500 },
  { minKm: 900, maxKm: 1200, w500g: 17000, w1kg: 25500, w2kg: 40000, w3kg: 51000, w5kg: 65000 },
  {
    minKm: 1200,
    maxKm: Infinity,
    w500g: 20000,
    w1kg: 30000,
    w2kg: 47000,
    w3kg: 60000,
    w5kg: 75000,
    perKmAbove1200Paise: 15, // ₹0.15/km per kg above 1200 km
  },
];

/** Per-kg extension rate for parcels > 5.0 kg in Integer Paise */
export const EXTRA_WEIGHT_PER_KG_PAISE = 2000; // ₹20 / kg above 5 kg

/** Detour Pricing Tiers in Integer Paise */
export interface DetourFeeTier {
  maxDetourKm: number;
  feePaise: number;
}

export const DETOUR_FEE_TIERS: DetourFeeTier[] = [
  { maxDetourKm: 2.0, feePaise: 0 },       // 0–2 km = ₹0
  { maxDetourKm: 5.0, feePaise: 1500 },    // 2–5 km = ₹15
  { maxDetourKm: 10.0, feePaise: 3000 },   // 5–10 km = ₹30
  { maxDetourKm: 20.0, feePaise: 5000 },   // 10–20 km = ₹50
  { maxDetourKm: Infinity, feePaise: 8000 }, // >20 km = ₹80 special handling
];

/** RIDEEL Platform Fee percentage (15% of traveler payout) */
export const PLATFORM_FEE_PERCENT = 0.15;

/** Delivery Speed Surcharges in Integer Paise */
export const URGENCY_SURCHARGES_PAISE: Record<string, number> = {
  FLEXIBLE: 0,                 // Flexible / within 24 hrs: ₹0
  TOMORROW_MORNING: 1000,     // Tomorrow Morning: ₹10
  TODAY_EVENING: 1500,        // Today Evening: ₹15
  SAME_DAY: 2500,             // Same-Day: ₹25
  EXPRESS: 5000,              // Same-Day Express: ₹50
  SAME_DAY_EXPRESS: 5000,     // Same-Day Express: ₹50
};

/** Operational buffer in minutes for Same-Day Express eligibility check (e.g. 45 min) */
export const EXPRESS_OPERATIONAL_BUFFER_MINUTES = 45;

/** Maximum duration in minutes for Same-Day Express eligibility (3 hours = 180 min) */
export const EXPRESS_MAX_DURATION_MINUTES = 180;

/** Optional Service Fees in Integer Paise */
export const OPTIONAL_SERVICES_PAISE = {
  PICKUP_ASSISTANCE: 2000,    // Pickup assistance: ₹20
  DROP_ASSISTANCE: 2000,      // Drop assistance: ₹20
  INSURANCE_MIN: 1500,        // Minimum Insurance: ₹15
  INSURANCE_PERCENT: 0.01,    // 1% of declared value
};

/** Default Traveler Capacity if unspecified */
export const DEFAULT_TRAVELER_CAPACITY_KG = 5.0;

/** Rounding increment for final sender price: nearest ₹5 = 500 Paise */
export const SENDER_PRICE_ROUNDING_PAISE = 500;

/** Engine Version */
export const PRICING_VERSION = '2.0';
