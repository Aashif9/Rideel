import { Parcel, Trip } from '@/types';

export interface MatchResult {
  trip: Trip;
  match_score: number;
  breakdown: {
    route_score: number;
    date_score: number;
    capacity_score: number;
    timing_score: number;
    rating_score: number;
    verification_score: number;
  };
  reasons: string[];
}

export function calculateMatchScore(parcel: Parcel, trip: Trip): MatchResult {
  const reasons: string[] = [];
  let routeScore = 0;
  let dateScore = 0;
  let capacityScore = 0;
  let timingScore = 0;
  let ratingScore = 0;
  let verificationScore = 0;

  // 1. Route Match (Weight: 40%)
  const originMatch = parcel.origin.toLowerCase() === trip.origin.toLowerCase();
  const destMatch = parcel.destination.toLowerCase() === trip.destination.toLowerCase();
  
  if (originMatch && destMatch) {
    routeScore = 40;
    reasons.push("Direct origin & destination match");
  } else if (originMatch || destMatch) {
    routeScore = 20;
    reasons.push("Partial route corridor alignment");
  }

  // 2. Date Match (Weight: 20%)
  if (parcel.travel_date === trip.travel_date) {
    dateScore = 20;
    reasons.push("Same-day travel match");
  } else {
    // Check if within 1 day
    const parcelDate = new Date(parcel.travel_date).getTime();
    const tripDate = new Date(trip.travel_date).getTime();
    const diffDays = Math.abs(parcelDate - tripDate) / (1000 * 3600 * 24);
    if (diffDays <= 1) {
      dateScore = 12;
      reasons.push("Travel date within 24 hours");
    }
  }

  // 3. Capacity & Weight Match (Weight: 15%)
  if (trip.available_capacity_kg >= parcel.weight_kg && trip.max_weight_kg >= parcel.weight_kg) {
    capacityScore = 15;
    reasons.push(`Capacity verified (${trip.available_capacity_kg} kg available vs ${parcel.weight_kg} kg parcel)`);
  } else {
    capacityScore = 0;
    reasons.push("Insufficient available capacity for parcel weight");
  }

  // 4. Departure Timing (Weight: 10%)
  if (trip.departure_time) {
    timingScore = 10;
    reasons.push(`Departure scheduled at ${trip.departure_time}`);
  }

  // 5. Traveler Rating (Weight: 10%)
  const rating = trip.traveler?.rating || 4.5;
  ratingScore = Math.round((rating / 5.0) * 10);
  if (rating >= 4.8) {
    reasons.push(`Top-rated traveler (${rating} ★)`);
  }

  // 6. Verification Bonus (Weight: 5%)
  if (trip.traveler?.is_kyc_verified) {
    verificationScore = 5;
    reasons.push("KYC & Identity Verified Traveler");
  }

  const totalScore = Math.min(
    100,
    routeScore + dateScore + capacityScore + timingScore + ratingScore + verificationScore
  );

  return {
    trip,
    match_score: totalScore,
    breakdown: {
      route_score: routeScore,
      date_score: dateScore,
      capacity_score: capacityScore,
      timing_score: timingScore,
      rating_score: ratingScore,
      verification_score: verificationScore
    },
    reasons
  };
}

export function rankMatchingTrips(parcel: Parcel, trips: Trip[]): MatchResult[] {
  return trips
    .map(trip => calculateMatchScore(parcel, trip))
    .filter(match => match.match_score >= 40 && match.trip.available_capacity_kg >= parcel.weight_kg)
    .sort((a, b) => b.match_score - a.match_score);
}
