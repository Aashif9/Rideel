import { LocationPayload } from './tracking.types';

export function validateLocationPayload(payload: any): { valid: boolean; error?: string; data?: LocationPayload } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Payload must be a non-null object' };
  }

  const { deliveryId, latitude, longitude, accuracy, speed, heading, timestamp, travelerId, travelerName } = payload;

  if (!deliveryId || typeof deliveryId !== 'string' || deliveryId.trim() === '') {
    return { valid: false, error: 'deliveryId is required and must be a non-empty string' };
  }

  const latNum = Number(latitude);
  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return { valid: false, error: 'latitude must be a valid number between -90 and 90' };
  }

  const lngNum = Number(longitude);
  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return { valid: false, error: 'longitude must be a valid number between -180 and 180' };
  }

  let accNum: number | undefined;
  if (accuracy !== undefined && accuracy !== null) {
    accNum = Number(accuracy);
    if (isNaN(accNum) || accNum < 0) {
      return { valid: false, error: 'accuracy must be a non-negative number' };
    }
  }

  let speedNum: number | undefined;
  if (speed !== undefined && speed !== null) {
    speedNum = Number(speed);
    if (isNaN(speedNum) || speedNum < 0) {
      return { valid: false, error: 'speed must be a non-negative number' };
    }
  }

  let headingNum: number | undefined;
  if (heading !== undefined && heading !== null) {
    headingNum = Number(heading);
    if (isNaN(headingNum) || headingNum < 0 || headingNum > 360) {
      return { valid: false, error: 'heading must be a number between 0 and 360' };
    }
  }

  let isoTime = timestamp;
  if (!timestamp) {
    isoTime = new Date().toISOString();
  } else {
    const parsedDate = new Date(timestamp);
    if (isNaN(parsedDate.getTime())) {
      return { valid: false, error: 'timestamp must be a valid ISO date string' };
    }
    isoTime = parsedDate.toISOString();
  }

  return {
    valid: true,
    data: {
      deliveryId: String(deliveryId).trim(),
      latitude: latNum,
      longitude: lngNum,
      accuracy: accNum,
      speed: speedNum,
      heading: headingNum,
      timestamp: isoTime,
      travelerId: travelerId ? String(travelerId) : undefined,
      travelerName: travelerName ? String(travelerName) : undefined,
    },
  };
}
