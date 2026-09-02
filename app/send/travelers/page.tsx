'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { Trip } from '@/types';
import {
  ShieldCheck, Star, Sparkles, ArrowRight, ChevronRight, Truck,
  MapPin, Clock, Filter, CheckCircle2, User
} from 'lucide-react';

interface RankedMatch {
  trip: Trip;
  match_score: number;
  reasons: string[];
}

export default function AvailableTravelersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parcelId = searchParams.get('parcelId');

  const [matches, setMatches] = useState<RankedMatch[]>([]);
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'rating' | 'departure'>('match');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parcelId) {
      apiServices.findMatchingTravelers(parcelId).then(results => {
        setMatches(results);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [parcelId]);

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'match') return b.match_score - a.match_score;
    if (sortBy === 'price') return a.trip.price_per_kg - b.trip.price_per_kg;
    if (sortBy === 'rating') return (b.trip.traveler?.rating || 0) - (a.trip.traveler?.rating || 0);
    return a.trip.departure_time.localeCompare(b.trip.departure_time);
  });

  const handleSelectTraveler = (tripId: string) => {
    router.push(`/send/booking-summary?parcelId=${parcelId}&tripId=${tripId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Timeline Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b pb-4">
        <span className="text-slate-500">Route & Handoff</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-500">Parcel Details</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary font-extrabold flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">3</span>
          Match Traveler
        </span>
        <ChevronRight className="w-4 h-4" />
        <span>Payment & Escrow</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Verified Travelers On Route</h1>
          <p className="text-xs text-slate-500">Ranked by RIDEEL Matching Engine (Route, Date, Capacity & Ratings)</p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-outline-variant rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary"
          >
            <option value="match">Best Match Score</option>
            <option value="price">Lowest Price / kg</option>
            <option value="rating">Highest Traveler Rating</option>
            <option value="departure">Earliest Departure</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Matching route capacity with verified travelers...</p>
        </div>
      ) : sortedMatches.length === 0 ? (
        <div className="rideel-card p-12 text-center space-y-4">
          <Truck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Travelers Found for this Specific Corridor</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your travel date or post a parcel request so travelers on this route can accept it.
          </p>
          <button
            onClick={() => router.push('/send')}
            className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container transition"
          >
            Modify Route Search
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMatches.map(({ trip, match_score, reasons }) => {
            const traveler = trip.traveler;
            return (
              <div key={trip.id} className="rideel-card rideel-card-interactive p-5 md:p-6 space-y-4 hover:border-primary">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  {/* Traveler Avatar & Verification */}
                  <div className="flex items-center gap-3">
                    <img
                      src={traveler?.profile_photo}
                      alt={traveler?.full_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-slate-900 text-base">{traveler?.full_name}</h3>
                        {traveler?.is_kyc_verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {traveler?.rating}
                        </span>
                        <span>•</span>
                        <span>{traveler?.completed_deliveries} deliveries completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right flex items-center sm:block gap-3">
                    <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match_score}% MATCH SCORE</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      Capacity: <strong>{trip.available_capacity_kg} kg left</strong>
                    </div>
                  </div>
                </div>

                {/* Trip Route Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Departure</span>
                    <div className="font-bold text-slate-900">{trip.departure_time} ({trip.travel_date})</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Arrival</span>
                    <div className="font-bold text-slate-900">{trip.estimated_arrival}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Vehicle</span>
                    <div className="font-bold text-slate-900 uppercase">{trip.vehicle_id ? 'Car / SUV' : 'Private Carrier'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Parcel Rate</span>
                    <div className="font-extrabold text-primary">₹{trip.price_per_kg} / kg</div>
                  </div>
                </div>

                {/* Match Reasons Pill List */}
                <div className="flex flex-wrap items-center gap-2">
                  {reasons.slice(0, 3).map((r, i) => (
                    <span key={i} className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {r}
                    </span>
                  ))}
                </div>

                {/* Select Button */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Est Total Courier Fee: <strong className="text-primary text-sm">₹{Math.round(3.5 * trip.price_per_kg + 50)}</strong>
                  </div>
                  <button
                    onClick={() => handleSelectTraveler(trip.id)}
                    className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition shadow-md flex items-center gap-2"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
