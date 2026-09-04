'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { Trip, Delivery } from '@/types';
import MapComponent from '@/components/tracking/MapComponent';
import OTPModal from '@/components/tracking/OTPModal';
import {
  Truck, KeyRound, ShieldCheck, CheckCircle2, MessageSquare,
  ArrowLeft, DollarSign, Package, User, Clock
} from 'lucide-react';

import { useLiveLocation } from '@/hooks/useLiveLocation';

export default function ActiveTripControlPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const [gmapsRouteInfo, setGmapsRouteInfo] = useState<{ durationText: string; distanceText: string; calculatedEta: string } | null>(null);

  const [activeOtpDelivery, setActiveOtpDelivery] = useState<Delivery | null>(null);
  const [otpModalMode, setOtpModalMode] = useState<'pickup' | 'delivery' | null>(null);

  const activeDeliveryId = deliveries[0]?.id || tripId;

  // Real-Time Socket.IO GPS Live Location Publisher Hook for Travelers
  const {
    currentLocation,
    isTracking,
    isLive,
    isStale,
    lastUpdatedAgo,
    error: gpsError,
    startTracking,
    stopTracking,
  } = useLiveLocation({
    deliveryId: activeDeliveryId,
    travelerId: trip?.traveler_id || 'traveler_1',
    role: 'traveler',
    isTraveler: true,
  });

  useEffect(() => {
    if (tripId) {
      apiServices.getTripById(tripId).then(t => {
        setTrip(t || null);
      });

      apiServices.getDeliveries().then(dList => {
        const tripDels = dList.filter(d => d.trip_id === tripId);
        setDeliveries(tripDels);
        setLoading(false);
      });
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto rideel-card p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Trip Record Not Found</h3>
        <button onClick={() => router.push('/trips')} className="bg-primary text-white text-xs font-bold px-6 py-2 rounded-xl">
          Back to Trips
        </button>
      </div>
    );
  }

  const handleVerifyPickup = async (code: string) => {
    if (!activeOtpDelivery) return { success: false, message: 'No delivery selected' };
    const res = await apiServices.verifyPickupOTP(activeOtpDelivery.id, code);
    if (res.success) {
      // Refresh state
      const updated = await apiServices.getDeliveries();
      setDeliveries(updated.filter(d => d.trip_id === tripId));
    }
    return res;
  };

  const handleVerifyDelivery = async (code: string) => {
    if (!activeOtpDelivery) return { success: false, message: 'No delivery selected' };
    const res = await apiServices.verifyDeliveryOTP(activeOtpDelivery.id, code);
    if (res.success) {
      const updated = await apiServices.getDeliveries();
      setDeliveries(updated.filter(d => d.trip_id === tripId));
    }
    return res;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/trips')} className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </button>
        <span className="text-xs font-mono font-bold text-slate-400">TRIP: {trip.id}</span>
      </div>

      <div className="rideel-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary">
              {trip.origin} → {trip.destination}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Departs: {trip.departure_time} | Est Arrival: {trip.estimated_arrival}
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase">
            {trip.status}
          </span>
        </div>

        {/* Google Maps Dynamic Estimated Travel Time Banner */}
        <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#002b5c] text-white flex items-center justify-center shadow-xs shrink-0">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#002b5c] uppercase tracking-wider">
                  GOOGLE MAPS ESTIMATED TIME
                </span>
                {isTracking && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Live GPS Active
                  </span>
                )}
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {gmapsRouteInfo ? (
                  <span>
                    Est. Arrival: <strong className="text-[#002b5c]">{gmapsRouteInfo.calculatedEta}</strong> ({gmapsRouteInfo.durationText} • {gmapsRouteInfo.distanceText})
                  </span>
                ) : (
                  <span>Est. Arrival: <strong className="text-[#002b5c]">{trip.estimated_arrival}</strong> (Calculating live traffic...)</span>
                )}
              </div>
            </div>
          </div>

          {/* Clean GPS Broadcast Controls */}
          {isTracking ? (
            <button
              onClick={stopTracking}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-black transition active:scale-95 shadow-sm uppercase tracking-wider shrink-0"
            >
              Stop GPS
            </button>
          ) : (
            <button
              onClick={startTracking}
              className="bg-[#002b5c] hover:bg-[#001f44] text-white px-5 py-2.5 rounded-xl text-xs font-black transition active:scale-95 shadow-sm uppercase tracking-wider shrink-0 flex items-center gap-1.5"
            >
              <span>Start Live GPS</span>
            </button>
          )}
        </div>

        {gpsError && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <span>⚠️ {gpsError}</span>
          </div>
        )}

        {/* Route Tracking Map with Live Google Maps Directions */}
        <MapComponent
          origin={trip.origin}
          destination={trip.destination}
          travelerName={trip.traveler?.full_name || 'You'}
          status={trip.status}
          eta={gmapsRouteInfo?.calculatedEta || trip.estimated_arrival}
          currentLat={currentLocation?.latitude}
          currentLng={currentLocation?.longitude}
          isLive={isLive}
          isStale={isStale}
          speed={currentLocation?.speed}
          accuracy={currentLocation?.accuracy}
          lastUpdatedAgo={lastUpdatedAgo}
          onRouteCalculated={(info) => setGmapsRouteInfo(info)}
        />
      </div>

      {/* Accepted Parcels & Handoff Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-container" /> Accepted Parcels ({deliveries.length})
        </h3>

        {deliveries.length === 0 ? (
          <div className="rideel-card p-8 text-center text-xs text-slate-500">
            No parcel match requests accepted for this trip yet.
          </div>
        ) : (
          deliveries.map((del) => (
            <div key={del.id} className="rideel-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400">DELIVERY ID: {del.id}</span>
                  <h4 className="font-extrabold text-slate-900 text-base">{del.parcel?.description}</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {del.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 bg-surface-container p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sender</span>
                  <span className="font-bold text-slate-900">{del.sender?.full_name || 'Sender'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight</span>
                  <span className="font-bold text-slate-900">{del.parcel?.weight_kg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Payout</span>
                  <span className="font-extrabold text-emerald-700">₹{del.traveler_payout}</span>
                </div>
              </div>

              {/* Action Buttons for Traveler */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  href={`/chat/${del.id}`}
                  className="text-xs font-bold text-slate-700 hover:text-primary flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-primary-container" /> Contact Sender
                </Link>

                {del.status === 'ACCEPTED' || del.status === 'PICKUP_PENDING' ? (
                  <button
                    onClick={() => {
                      setActiveOtpDelivery(del);
                      setOtpModalMode('pickup');
                    }}
                    className="bg-primary text-white text-xs font-extrabold px-5 py-2.5 rounded-xl hover:bg-primary-container transition shadow-md flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4 text-amber-300" /> Enter Pickup OTP
                  </button>
                ) : del.status === 'PICKED_UP' || del.status === 'IN_TRANSIT' || del.status === 'DELIVERY_PENDING' ? (
                  <button
                    onClick={() => {
                      setActiveOtpDelivery(del);
                      setOtpModalMode('delivery');
                    }}
                    className="bg-emerald-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-md flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" /> Enter Delivery OTP to Payout
                  </button>
                ) : del.status === 'DELIVERED' ? (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ₹{del.traveler_payout} Payout Credited to Wallet
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {/* OTP Verification Modals */}
      {otpModalMode === 'pickup' && activeOtpDelivery && (
        <OTPModal
          isOpen={true}
          onClose={() => setOtpModalMode(null)}
          title="Enter Pickup Verification OTP"
          subtitle="Ask the parcel sender for their 6-digit Pickup OTP code."
          isTraveler={true}
          onVerify={handleVerifyPickup}
        />
      )}

      {otpModalMode === 'delivery' && activeOtpDelivery && (
        <OTPModal
          isOpen={true}
          onClose={() => setOtpModalMode(null)}
          title="Enter Receiver Delivery OTP"
          subtitle="Ask the receiver for their 6-digit Delivery OTP code to complete payout."
          isTraveler={true}
          onVerify={handleVerifyDelivery}
        />
      )}
    </div>
  );
}
