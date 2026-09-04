import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// GET /api/deliveries/active
// Fetches active deliveries directly from PostgreSQL database
router.get('/deliveries/active', async (req: Request, res: Response) => {
  try {
    // Check if bookings exist in database
    const bookingRes = await query(`
      SELECT 
        b.id,
        b.ride_id,
        b.sender_id,
        b.weight_kg,
        b.total_price as total_amount,
        b.status,
        b.created_at,
        r.origin,
        r.destination,
        r.travel_date,
        r.departure_time,
        u.full_name as traveler_name,
        u.profile_photo as traveler_photo
      FROM bookings b
      LEFT JOIN rides r ON b.ride_id = r.id
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `);

    if (bookingRes.rows.length === 0) {
      return res.json({
        success: true,
        source: 'PostgreSQL',
        deliveries: []
      });
    }

    res.json({
      success: true,
      source: 'PostgreSQL Database',
      deliveries: bookingRes.rows
    });
  } catch (error: any) {
    console.error('PostgreSQL Active Deliveries Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/deliveries/:deliveryId/location
// Fetches the latest known GPS location for a specific delivery
router.get('/deliveries/:deliveryId/location', async (req: Request, res: Response) => {
  try {
    const deliveryId = String(req.params.deliveryId);
    const { trackingService } = await import('../tracking/tracking.service');
    const location = await trackingService.getLatestLocation(deliveryId);

    if (!location) {
      return res.json({
        success: true,
        location: null,
        message: 'No GPS location updates recorded yet for this delivery.',
      });
    }

    res.json({
      success: true,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        speed: location.speed,
        heading: location.heading,
        timestamp: location.timestamp,
        travelerId: location.travelerId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
