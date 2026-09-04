import { Router, Request, Response } from 'express';
import { pricingService } from './pricing.service';
import { PricingQuoteRequest } from './pricing.types';

const router = Router();

/**
 * POST /api/pricing/quote
 * Computes authoritative delivery pricing quote breakdown for RIDEEL V2 Shared Traveler Capacity Model
 */
router.post('/pricing/quote', async (req: Request, res: Response) => {
  try {
    const {
      pickup,
      dropoff,
      weightKg,
      packageType,
      deliverySpeed,
      pickupAssistance,
      dropAssistance,
      insuranceSelected,
      insurance,
      declaredValue,
      travelerCapacityKg,
      travelerDepartureTime,
      detourDistanceKm,
    } = req.body;

    if (!pickup || !dropoff) {
      return res.status(400).json({
        success: false,
        message: 'Pickup and dropoff locations are required.',
      });
    }

    const payload: PricingQuoteRequest = {
      pickup: {
        lat: typeof pickup.lat === 'number' ? pickup.lat : undefined,
        lng: typeof pickup.lng === 'number' ? pickup.lng : undefined,
        name: typeof pickup.name === 'string' ? pickup.name : String(pickup),
      },
      dropoff: {
        lat: typeof dropoff.lat === 'number' ? dropoff.lat : undefined,
        lng: typeof dropoff.lng === 'number' ? dropoff.lng : undefined,
        name: typeof dropoff.name === 'string' ? dropoff.name : String(dropoff),
      },
      weightKg: Number(weightKg) || 1.0,
      packageType,
      deliverySpeed,
      pickupAssistance: Boolean(pickupAssistance),
      dropAssistance: Boolean(dropAssistance),
      insuranceSelected: Boolean(insuranceSelected || insurance),
      declaredValue: Number(declaredValue) || 1000,
      travelerCapacityKg: Number(travelerCapacityKg) || 5.0,
      travelerDepartureTime: travelerDepartureTime ? String(travelerDepartureTime) : undefined,
      detourDistanceKm: Number(detourDistanceKm) || 0,
    };

    const quote = await pricingService.calculateQuote(payload);

    return res.status(200).json({
      success: true,
      quote,
    });
  } catch (err: any) {
    console.error('[Pricing API Error]', err.message || err);
    return res.status(400).json({
      success: false,
      message:
        err.message ||
        'Unable to calculate delivery price. Please check your pickup and dropoff locations.',
    });
  }
});

export default router;
