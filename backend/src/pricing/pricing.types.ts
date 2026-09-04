/**
 * RIDEEL Pricing Engine V2 Types & Interfaces
 * Shared Traveler Capacity Model & Route-Aware Delivery Deadlines
 */

export interface PricingQuoteRequest {
  pickup: {
    lat?: number;
    lng?: number;
    name: string;
  };
  dropoff: {
    lat?: number;
    lng?: number;
    name: string;
  };
  weightKg: number;
  packageType?: string;
  deliverySpeed?: string; // FLEXIBLE, TOMORROW_MORNING, TODAY_EVENING, SAME_DAY, SAME_DAY_EXPRESS
  pickupAssistance?: boolean;
  dropAssistance?: boolean;
  insuranceSelected?: boolean;
  insurance?: boolean;
  declaredValue?: number;
  travelerCapacityKg?: number; // Default 5kg
  travelerDepartureTime?: string; // ISO or HH:mm time string
  detourDistanceKm?: number; // Optional explicitly passed detour
}

export interface DeliverySpeedOption {
  id: string;
  title: string;
  label: string;
  fee: number;
  feeFormatted: string;
  isAvailable: boolean;
  estimatedDeliveryTime: string;
  description: string;
}

export interface PricingQuoteBreakdown {
  distanceKm: number;
  estimatedDurationMinutes: number;
  parcelWeightKg: number;
  travelerCapacityKg: number;
  remainingCapacityKg: number;
  travelerPayout: number;
  platformFee: number;
  deliverySpeed: string;
  deliverySpeedFee: number;
  detourDistanceKm: number;
  detourFee: number;
  pickupFee: number;
  dropFee: number;
  insuranceFee: number;
  subtotal: number;
  senderPrice: number;
  estimatedDeliveryTime: string;
  isExpressEligible: boolean;
  availableSpeedOptions: DeliverySpeedOption[];
  pricingVersion: string;
  currency: string;
  formatted: {
    travelerPayout: string;
    platformFee: string;
    deliverySpeedFee: string;
    detourFee: string;
    pickupFee: string;
    dropFee: string;
    insuranceFee: string;
    subtotal: string;
    senderPrice: string;
  };
}

export interface PricingQuotePaise {
  distanceKm: number;
  estimatedDurationMinutes: number;
  parcelWeightKg: number;
  travelerCapacityKg: number;
  travelerPayoutPaise: number;
  platformFeePaise: number;
  deliverySpeedFeePaise: number;
  detourDistanceKm: number;
  detourFeePaise: number;
  pickupFeePaise: number;
  dropFeePaise: number;
  insuranceFeePaise: number;
  subtotalPaise: number;
  senderPricePaise: number;
}
