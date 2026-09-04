import {
  PAYOUT_MATRIX,
  EXTRA_WEIGHT_PER_KG_PAISE,
  DETOUR_FEE_TIERS,
  PLATFORM_FEE_PERCENT,
  URGENCY_SURCHARGES_PAISE,
  EXPRESS_OPERATIONAL_BUFFER_MINUTES,
  EXPRESS_MAX_DURATION_MINUTES,
  OPTIONAL_SERVICES_PAISE,
  DEFAULT_TRAVELER_CAPACITY_KG,
  SENDER_PRICE_ROUNDING_PAISE,
  PRICING_VERSION,
  PayoutMatrixRow,
} from './pricing.config';
import {
  PricingQuoteRequest,
  PricingQuoteBreakdown,
  DeliverySpeedOption,
} from './pricing.types';

export class PricingService {
  /**
   * Calculates road distance in kilometers between two lat/lng coordinates
   * applying a 1.25x intercity road curvature factor.
   */
  public calculateRoadDistanceKm(
    pickupLat?: number,
    pickupLng?: number,
    dropoffLat?: number,
    dropoffLng?: number,
    pickupName?: string,
    dropoffName?: string
  ): number {
    if (
      typeof pickupLat !== 'number' ||
      typeof pickupLng !== 'number' ||
      typeof dropoffLat !== 'number' ||
      typeof dropoffLng !== 'number'
    ) {
      const pName = (pickupName || '').toLowerCase();
      const dName = (dropoffName || '').toLowerCase();

      if (
        (pName.includes('bhimavaram') && dName.includes('chennai')) ||
        (pName.includes('chennai') && dName.includes('bhimavaram'))
      ) {
        return 430;
      }
      if (
        (pName.includes('vijayawada') && dName.includes('hyderabad')) ||
        (pName.includes('hyderabad') && dName.includes('vijayawada'))
      ) {
        return 275;
      }
      if (
        (pName.includes('chennai') && dName.includes('bangalore')) ||
        (pName.includes('bangalore') && dName.includes('chennai'))
      ) {
        return 345;
      }
      if (pName && dName && pName === dName) {
        return 10;
      }
      return 150;
    }

    const R = 6371; // Earth radius in km
    const dLat = this.toRadians(dropoffLat - pickupLat);
    const dLng = this.toRadians(dropoffLng - pickupLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(pickupLat)) *
        Math.cos(this.toRadians(dropoffLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLineKm = R * c;

    const roadKm = Math.round(straightLineKm * 1.25);
    return Math.max(1, roadKm);
  }

  /**
   * Calculates estimated travel duration in minutes based on distance (60 km/h average speed + 20 min traffic buffer)
   */
  public calculateEstimatedDurationMinutes(distanceKm: number): number {
    const travelMinutes = Math.round((distanceKm / 60) * 60);
    return travelMinutes + 20; // 20 min buffer
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Calculates Traveler Payout in integer PAISE from distance x weight matrix
   */
  public calculateTravelerPayoutPaise(distanceKm: number, weightKg: number): number {
    const row = PAYOUT_MATRIX.find(
      (r) => distanceKm >= r.minKm && distanceKm <= r.maxKm
    ) || PAYOUT_MATRIX[PAYOUT_MATRIX.length - 1];

    let extraDistancePaise = 0;
    if (row.perKmAbove1200Paise && distanceKm > 1200) {
      extraDistancePaise = Math.round((distanceKm - 1200) * row.perKmAbove1200Paise);
    }

    const w500g = row.w500g + extraDistancePaise;
    const w1kg = row.w1kg + extraDistancePaise;
    const w2kg = row.w2kg + extraDistancePaise;
    const w3kg = row.w3kg + extraDistancePaise;
    const w5kg = row.w5kg + extraDistancePaise;

    // Linear weight interpolation
    if (weightKg <= 0.5) {
      return w500g;
    }
    if (weightKg <= 1.0) {
      const t = (weightKg - 0.5) / 0.5;
      return Math.round(w500g + t * (w1kg - w500g));
    }
    if (weightKg <= 2.0) {
      const t = (weightKg - 1.0) / 1.0;
      return Math.round(w1kg + t * (w2kg - w1kg));
    }
    if (weightKg <= 3.0) {
      const t = (weightKg - 2.0) / 1.0;
      return Math.round(w2kg + t * (w3kg - w2kg));
    }
    if (weightKg <= 5.0) {
      const t = (weightKg - 3.0) / 2.0;
      return Math.round(w3kg + t * (w5kg - w3kg));
    }

    // Weight > 5.0 kg
    const extraWeightKg = weightKg - 5.0;
    return Math.round(w5kg + extraWeightKg * EXTRA_WEIGHT_PER_KG_PAISE);
  }

  /**
   * Calculates Detour Fee in integer PAISE
   */
  public calculateDetourFeePaise(detourKm: number): number {
    const tier = DETOUR_FEE_TIERS.find((t) => detourKm <= t.maxDetourKm);
    return tier ? tier.feePaise : 8000;
  }

  /**
   * Evaluates route-aware delivery speed availability and formats realistic options
   */
  public getRouteAwareSpeedOptions(
    estimatedDurationMinutes: number,
    departureTimeStr?: string
  ): { isExpressEligible: boolean; options: DeliverySpeedOption[] } {
    const isExpressEligible =
      estimatedDurationMinutes + EXPRESS_OPERATIONAL_BUFFER_MINUTES <=
      EXPRESS_MAX_DURATION_MINUTES;

    const options: DeliverySpeedOption[] = [];

    if (isExpressEligible) {
      options.push({
        id: 'SAME_DAY_EXPRESS',
        title: 'Same-Day Express ⚡',
        label: '⚡ Same-Day Express — within 3 hrs',
        fee: URGENCY_SURCHARGES_PAISE.SAME_DAY_EXPRESS / 100,
        feeFormatted: `+₹${URGENCY_SURCHARGES_PAISE.SAME_DAY_EXPRESS / 100}`,
        isAvailable: true,
        estimatedDeliveryTime: 'Within 3 hours',
        description: 'Fastest direct courier handoff',
      });
    }

    options.push({
      id: 'SAME_DAY',
      title: 'Same-Day 🚚',
      label: '🚚 Same-Day — by 8:00 PM',
      fee: URGENCY_SURCHARGES_PAISE.SAME_DAY / 100,
      feeFormatted: `+₹${URGENCY_SURCHARGES_PAISE.SAME_DAY / 100}`,
      isAvailable: true,
      estimatedDeliveryTime: 'Today by 8:00 PM',
      description: 'Delivered by traveler on arrival',
    });

    options.push({
      id: 'TODAY_EVENING',
      title: 'Today Evening 🌙',
      label: '🌙 Today Evening — by 10:00 PM',
      fee: URGENCY_SURCHARGES_PAISE.TODAY_EVENING / 100,
      feeFormatted: `+₹${URGENCY_SURCHARGES_PAISE.TODAY_EVENING / 100}`,
      isAvailable: true,
      estimatedDeliveryTime: 'Today by 10:00 PM',
      description: 'Evening arrival dropoff',
    });

    options.push({
      id: 'TOMORROW_MORNING',
      title: 'Tomorrow Morning 🌅',
      label: '🌅 Tomorrow Morning — by 10:00 AM',
      fee: URGENCY_SURCHARGES_PAISE.TOMORROW_MORNING / 100,
      feeFormatted: `+₹${URGENCY_SURCHARGES_PAISE.TOMORROW_MORNING / 100}`,
      isAvailable: true,
      estimatedDeliveryTime: 'Tomorrow by 10:00 AM',
      description: 'Overnight / morning delivery',
    });

    options.push({
      id: 'FLEXIBLE',
      title: 'Flexible 📦',
      label: '📦 Flexible — within 24 hrs',
      fee: URGENCY_SURCHARGES_PAISE.FLEXIBLE / 100,
      feeFormatted: 'No extra charge',
      isAvailable: true,
      estimatedDeliveryTime: 'Within 24 hours',
      description: 'Economy traveler delivery',
    });

    return { isExpressEligible, options };
  }

  /**
   * Authoritative calculation entry point (V2)
   */
  public async calculateQuote(
    request: PricingQuoteRequest
  ): Promise<PricingQuoteBreakdown> {
    const weightKg = Math.max(0.1, Math.min(50, Number(request.weightKg) || 1.0));
    const travelerCapacityKg = Math.max(
      weightKg,
      Number(request.travelerCapacityKg) || DEFAULT_TRAVELER_CAPACITY_KG
    );
    const detourKm = Math.max(0, Number(request.detourDistanceKm) || 0);

    // 1. Distance & Duration
    const distanceKm = this.calculateRoadDistanceKm(
      request.pickup.lat,
      request.pickup.lng,
      request.dropoff.lat,
      request.dropoff.lng,
      request.pickup.name,
      request.dropoff.name
    );

    const estimatedDurationMinutes = this.calculateEstimatedDurationMinutes(distanceKm);

    // 2. Route-Aware Speed Availability
    const { isExpressEligible, options: availableSpeedOptions } =
      this.getRouteAwareSpeedOptions(estimatedDurationMinutes, request.travelerDepartureTime);

    let speedKey = (request.deliverySpeed || 'SAME_DAY').toUpperCase();
    if (speedKey === 'SAME_DAY_EXPRESS' && !isExpressEligible) {
      speedKey = 'SAME_DAY'; // Downgrade impossible express requests safely
    }

    const deliverySpeedFeePaise = URGENCY_SURCHARGES_PAISE[speedKey] ?? 2500;

    // 3. Traveler Payout Matrix Lookup
    const travelerPayoutPaise = this.calculateTravelerPayoutPaise(distanceKm, weightKg);

    // 4. Platform Fee (15% of traveler payout)
    const platformFeePaise = Math.round(travelerPayoutPaise * PLATFORM_FEE_PERCENT);

    // 5. Detour Fee
    const detourFeePaise = this.calculateDetourFeePaise(detourKm);

    // 6. Optional Services
    const pickupFeePaise = request.pickupAssistance
      ? OPTIONAL_SERVICES_PAISE.PICKUP_ASSISTANCE
      : 0;
    const dropFeePaise = request.dropAssistance
      ? OPTIONAL_SERVICES_PAISE.DROP_ASSISTANCE
      : 0;

    let insuranceFeePaise = 0;
    if (request.insuranceSelected || request.insurance) {
      const declaredValPaise = Math.max(0, (request.declaredValue || 1000) * 100);
      const calculatedInsurance = Math.round(
        declaredValPaise * OPTIONAL_SERVICES_PAISE.INSURANCE_PERCENT
      );
      insuranceFeePaise = Math.max(
        OPTIONAL_SERVICES_PAISE.INSURANCE_MIN,
        calculatedInsurance
      );
    }

    // 7. Subtotal & Final Nearest ₹5 Rounded Sender Price
    const subtotalPaise =
      travelerPayoutPaise +
      platformFeePaise +
      deliverySpeedFeePaise +
      detourFeePaise +
      pickupFeePaise +
      dropFeePaise +
      insuranceFeePaise;

    const senderPricePaise =
      Math.round(subtotalPaise / SENDER_PRICE_ROUNDING_PAISE) *
      SENDER_PRICE_ROUNDING_PAISE;

    const remainingCapacityKg = Math.max(0, travelerCapacityKg - weightKg);

    const selectedSpeedOpt =
      availableSpeedOptions.find((o) => o.id === speedKey) ||
      availableSpeedOptions.find((o) => o.id === 'SAME_DAY') ||
      availableSpeedOptions[0];

    return {
      distanceKm,
      estimatedDurationMinutes,
      parcelWeightKg: weightKg,
      travelerCapacityKg,
      remainingCapacityKg,
      travelerPayout: travelerPayoutPaise / 100,
      platformFee: platformFeePaise / 100,
      deliverySpeed: speedKey,
      deliverySpeedFee: deliverySpeedFeePaise / 100,
      detourDistanceKm: detourKm,
      detourFee: detourFeePaise / 100,
      pickupFee: pickupFeePaise / 100,
      dropFee: dropFeePaise / 100,
      insuranceFee: insuranceFeePaise / 100,
      subtotal: subtotalPaise / 100,
      senderPrice: senderPricePaise / 100,
      estimatedDeliveryTime: selectedSpeedOpt.estimatedDeliveryTime,
      isExpressEligible,
      availableSpeedOptions,
      pricingVersion: PRICING_VERSION,
      currency: 'INR',
      formatted: {
        travelerPayout: `₹${(travelerPayoutPaise / 100).toFixed(0)}`,
        platformFee: `₹${(platformFeePaise / 100).toFixed(0)}`,
        deliverySpeedFee: `₹${(deliverySpeedFeePaise / 100).toFixed(0)}`,
        detourFee: `₹${(detourFeePaise / 100).toFixed(0)}`,
        pickupFee: `₹${(pickupFeePaise / 100).toFixed(0)}`,
        dropFee: `₹${(dropFeePaise / 100).toFixed(0)}`,
        insuranceFee: `₹${(insuranceFeePaise / 100).toFixed(0)}`,
        subtotal: `₹${(subtotalPaise / 100).toFixed(0)}`,
        senderPrice: `₹${(senderPricePaise / 100).toFixed(0)}`,
      },
    };
  }
}

export const pricingService = new PricingService();
