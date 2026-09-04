import { Router, Response } from 'express';
import { query, pool } from '../config/database';
import { authenticateToken, AuthenticatedRequest } from '../auth/auth.middleware';
import { pricingService } from '../pricing/pricing.service';

const router = Router();

/**
 * POST /api/match-requests
 * Sender creates a match request to a traveler (status = PENDING)
 * Validates remaining capacity & calculates authoritative V2 backend price quote.
 */
router.post('/match-requests', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const client = await pool.connect();
  try {
    const senderId = req.user?.userId;
    if (!senderId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const {
      parcelId,
      tripId,
      travelerId,
      matchScore,
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

    if (!parcelId || !tripId || !travelerId) {
      return res.status(400).json({ success: false, message: 'parcelId, tripId, and travelerId are required.' });
    }

    await client.query('BEGIN');

    // 1. Verify Traveler Exists
    const travelerCheck = await client.query(`SELECT id FROM users WHERE id = $1;`, [travelerId]);
    if (travelerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Target traveler not found.' });
    }

    const reqWeightKg = Math.max(0.1, Math.min(50, Number(weightKg) || 1.0));
    const tripCapacityKg = Math.max(reqWeightKg, Number(travelerCapacityKg) || 5.0);

    // 2. Capacity Validation & Row Locking Check
    const capacityRes = await client.query(
      `SELECT COALESCE(SUM(parcel_weight_kg), 0) as used_weight
       FROM match_requests
       WHERE trip_id = $1 AND status IN ('PENDING', 'ACCEPTED') AND expires_at > NOW();`,
      [tripId]
    );

    const usedWeight = parseFloat(capacityRes.rows[0]?.used_weight || '0');
    const remainingCapacity = Math.max(0, tripCapacityKg - usedWeight);

    if (reqWeightKg > remainingCapacity) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Requested parcel weight (${reqWeightKg} kg) exceeds remaining traveler carrying capacity (${remainingCapacity} kg).`,
        remainingCapacity,
      });
    }

    // 3. Authoritative V2 Backend Price Calculation
    const pickupObj = typeof pickup === 'object' && pickup !== null ? pickup : { name: String(pickup || 'Bhimavaram') };
    const dropoffObj = typeof dropoff === 'object' && dropoff !== null ? dropoff : { name: String(dropoff || 'Chennai') };

    const quote = await pricingService.calculateQuote({
      pickup: pickupObj,
      dropoff: dropoffObj,
      weightKg: reqWeightKg,
      packageType: packageType || 'DOCUMENT',
      deliverySpeed: deliverySpeed || 'SAME_DAY',
      pickupAssistance: Boolean(pickupAssistance),
      dropAssistance: Boolean(dropAssistance),
      insuranceSelected: Boolean(insuranceSelected || insurance),
      declaredValue: Number(declaredValue) || 1000,
      travelerCapacityKg: tripCapacityKg,
      travelerDepartureTime: travelerDepartureTime ? String(travelerDepartureTime) : undefined,
      detourDistanceKm: Number(detourDistanceKm) || 0,
    });

    // 4. Insert PENDING MatchRequest with Reserved Capacity & Price Snapshot
    const insertRes = await client.query(
      `INSERT INTO match_requests 
       (id, parcel_id, trip_id, sender_id, traveler_id, match_score, status, 
        parcel_weight_kg, traveler_capacity_kg, distance_km, traveler_payout, platform_fee,
        delivery_speed, delivery_speed_fee, detour_distance_km, detour_fee,
        pickup_fee, drop_fee, insurance_fee, sender_price, total_amount, estimated_delivery_time,
        pricing_version, pricing_breakdown, expires_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'PENDING',
               $6, $7, $8, $9, $10,
               $11, $12, $13, $14,
               $15, $16, $17, $18, $19, $20,
               $21, $22, NOW() + INTERVAL '24 hours')
       RETURNING *;`,
      [
        parcelId,
        tripId,
        senderId,
        travelerId,
        matchScore || 95.0,
        quote.parcelWeightKg,
        quote.travelerCapacityKg,
        quote.distanceKm,
        quote.travelerPayout,
        quote.platformFee,
        quote.deliverySpeed,
        quote.deliverySpeedFee,
        quote.detourDistanceKm,
        quote.detourFee,
        quote.pickupFee,
        quote.dropFee,
        quote.insuranceFee,
        quote.senderPrice,
        quote.senderPrice, // total_amount
        quote.estimatedDeliveryTime,
        quote.pricingVersion,
        JSON.stringify(quote),
      ]
    );

    const matchReq = insertRes.rows[0];

    // Notify Traveler (shows traveler payout, not private sender fees)
    await client.query(
      `INSERT INTO notifications (id, user_id, title, message, is_read)
       VALUES ($1, $2, $3, $4, false);`,
      [
        `notif_${Date.now()}`,
        travelerId,
        'New Parcel Delivery Request 📦',
        `A sender requested your route for parcel delivery (You earn ₹${quote.travelerPayout}). Tap to view and accept/reject.`,
      ]
    ).catch(() => {});

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Match request sent to traveler successfully.',
      matchRequest: matchReq,
      quote,
    });
  } catch (err: any) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[MatchRequest Error] Create failed:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create match request.' });
  } finally {
    client.release();
  }
});

/**
 * GET /api/match-requests/incoming
 * Traveler views incoming pending parcel requests with traveler payout & remaining capacity
 */
router.get('/match-requests/incoming', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const travelerId = req.user?.userId;
    if (!travelerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    // Auto-expire past due pending requests (releases reserved capacity)
    await query(
      `UPDATE match_requests SET status = 'EXPIRED' 
       WHERE traveler_id = $1 AND status = 'PENDING' AND expires_at <= NOW();`,
      [travelerId]
    ).catch(() => {});

    const requestsRes = await query(
      `SELECT mr.*, 
              u.full_name as sender_name, u.phone as sender_phone, u.rating as sender_rating, u.profile_photo as sender_photo
       FROM match_requests mr
       JOIN users u ON mr.sender_id = u.id
       WHERE mr.traveler_id = $1
       ORDER BY mr.created_at DESC;`,
      [travelerId]
    );

    return res.status(200).json({
      success: true,
      requests: requestsRes.rows,
    });
  } catch (err: any) {
    console.error('[MatchRequest Error] Fetch incoming failed:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch incoming requests.' });
  }
});

/**
 * GET /api/match-requests/outgoing
 * Sender views sent parcel requests
 */
router.get('/match-requests/outgoing', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const senderId = req.user?.userId;
    if (!senderId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const requestsRes = await query(
      `SELECT mr.*, 
              u.full_name as traveler_name, u.phone as traveler_phone, u.rating as traveler_rating, u.profile_photo as traveler_photo
       FROM match_requests mr
       JOIN users u ON mr.traveler_id = u.id
       WHERE mr.sender_id = $1
       ORDER BY mr.created_at DESC;`,
      [senderId]
    );

    return res.status(200).json({
      success: true,
      requests: requestsRes.rows,
    });
  } catch (err: any) {
    console.error('[MatchRequest Error] Fetch outgoing failed:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch outgoing requests.' });
  }
});

/**
 * POST /api/match-requests/:id/accept
 * Traveler accepts incoming parcel request (commits capacity reservation)
 */
router.post('/match-requests/:id/accept', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const travelerId = req.user?.userId;
    const { id } = req.params;

    if (!travelerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const fetchRes = await query(`SELECT * FROM match_requests WHERE id = $1;`, [id]);
    if (fetchRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Match request not found.' });
    }

    const matchReq = fetchRes.rows[0];

    // Security Check: Must belong to authenticated traveler
    if (matchReq.traveler_id !== travelerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only act on your own incoming requests.' });
    }

    if (matchReq.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Request is already ${matchReq.status.toLowerCase()}.` });
    }

    if (new Date(matchReq.expires_at).getTime() <= Date.now()) {
      await query(`UPDATE match_requests SET status = 'EXPIRED' WHERE id = $1;`, [id]);
      return res.status(400).json({ success: false, message: 'Request has expired.' });
    }

    // Update status to ACCEPTED
    await query(`UPDATE match_requests SET status = 'ACCEPTED' WHERE id = $1;`, [id]);

    // Notify Sender
    await query(
      `INSERT INTO notifications (id, user_id, title, message, is_read)
       VALUES ($1, $2, $3, $4, false);`,
      [
        `notif_${Date.now()}`,
        matchReq.sender_id,
        'Request Accepted! 🎉',
        `The traveler has accepted your parcel delivery request. Your booking is active.`
      ]
    ).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Request accepted successfully!',
      matchRequestId: id,
    });
  } catch (err: any) {
    console.error('[MatchRequest Error] Accept failed:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to accept request.' });
  }
});

/**
 * POST /api/match-requests/:id/reject
 * Traveler rejects incoming parcel request (releases capacity reservation)
 */
router.post('/match-requests/:id/reject', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const travelerId = req.user?.userId;
    const { id } = req.params;

    if (!travelerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const fetchRes = await query(`SELECT * FROM match_requests WHERE id = $1;`, [id]);
    if (fetchRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Match request not found.' });
    }

    const matchReq = fetchRes.rows[0];

    // Security Check: Must belong to authenticated traveler
    if (matchReq.traveler_id !== travelerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only act on your own incoming requests.' });
    }

    if (matchReq.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Request is already ${matchReq.status.toLowerCase()}.` });
    }

    // Update status to REJECTED (Releases capacity reservation)
    await query(`UPDATE match_requests SET status = 'REJECTED' WHERE id = $1;`, [id]);

    // Notify Sender
    await query(
      `INSERT INTO notifications (id, user_id, title, message, is_read)
       VALUES ($1, $2, $3, $4, false);`,
      [
        `notif_${Date.now()}`,
        matchReq.sender_id,
        'Request Update',
        `The traveler was unable to accept your request. You can choose another available traveler for your route.`
      ]
    ).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Request rejected.',
      matchRequestId: id,
    });
  } catch (err: any) {
    console.error('[MatchRequest Error] Reject failed:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to reject request.' });
  }
});

export default router;
