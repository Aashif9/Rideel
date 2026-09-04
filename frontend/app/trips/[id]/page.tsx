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
  ArrowLeft, DollarSign, Package, User, Clock, Check, X, AlertCircle, Navigation
} from 'lucide-react';

import { useLiveLocation } from '@/hooks/useLiveLocation';

export default function ActiveTripControlPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      loadTripDetails();
    }
  }, [tripId]);

  const loadTripDetails = async () => {
    setLoading(true);
    try {
      const t = await apiServices.getTripById(tripId);
      setTrip(t || null);

      const dList = await apiServices.getDeliveries();
      const tripDels = dList.filter(d => d.trip_id === tripId);
      setDeliveries(tripDels);

      // Fetch pending incoming match requests for this trip
      const token = typeof window !== 'undefined' ? localStorage.getItem('rideel_access_token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/match-requests/incoming` : `${baseUrl}/api/match-requests/incoming`;

      const res = await fetch(targetUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.requests) {
        const matchingTripReqs = data.requests.filter((r: any) => r.trip_id === tripId && r.status === 'PENDING');
        setIncomingRequests(matchingTripReqs);
      }
    } catch (err) {
      console.warn('Failed to load trip control details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setActionMsg(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rideel_access_token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/match-requests/${requestId}/accept` : `${baseUrl}/api/match-requests/${requestId}/accept`;

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: 'Parcel request accepted! Added to trip deliveries.' });
        loadTripDetails();
      } else {
        setActionMsg({ type: 'error', text: data.message || 'Failed to accept request.' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Network error accepting request.' });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setActionMsg(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rideel_access_token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/match-requests/${requestId}/reject` : `${baseUrl}/api/match-requests/${requestId}/reject`;

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: 'Parcel request declined.' });
        loadTripDetails();
      } else {
        setActionMsg({ type: 'error', text: data.message || 'Failed to decline request.' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Network error declining request.' });
    }
  };

  const handleVerifyPickup = async (code: string) => {
    if (!activeOtpDelivery) return { success: false, message: 'No delivery selected' };
    const res = await apiServices.verifyPickupOTP(activeOtpDelivery.id, code);
    if (res.success) {
      loadTripDetails();
    }
    return res;
  };

  const handleVerifyDelivery = async (code: string) => {
    if (!activeOtpDelivery) return { success: false, message: 'No delivery selected' };
    const res = await apiServices.verifyDeliveryOTP(activeOtpDelivery.id, code);
    if (res.success) {
      loadTripDetails();
    }
    return res;
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-bold mt-3">Loading trip control dashboard...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto rideel-card p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Trip Record Not Found</h3>
        <button onClick={() => router.push('/trips')} className="bg-[#002b5c] text-white text-xs font-bold px-6 py-2 rounded-xl">
          Back to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in p-2 sm:p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/trips')} className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </button>
        <span className="text-xs font-mono font-bold text-slate-400">TRIP ID: {trip.id}</span>
      </div>

      {/* Action Notification Alert */}
      {actionMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
          actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <span>{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-slate-600 font-black">✕</button>
        </div>
      )}

      {/* Main Control Card */}
      <div className="rideel-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
              {trip.origin} → {trip.destination}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Departs: {trip.departure_time} ({trip.travel_date}) • Rate: ₹{trip.price_per_kg}/kg • Remaining Capacity: {trip.available_capacity_kg} kg
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start">
            {trip.status}
          </span>
        </div>

        {/* Live GPS Telemetry Banner */}
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
                    Live GPS Broadcast Active
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

          {/* GPS Broadcast Controls */}
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
              <Navigation className="w-3.5 h-3.5" />
              <span>Start Live GPS</span>
            </button>
          )}
        </div>

        {gpsError && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <span>⚠️ {gpsError}</span>
          </div>
        )}

        {/* Real Interactive Google Map */}
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

      {/* Pending Incoming Match Requests for this Trip */}
      {incomingRequests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>Pending Parcel Requests for this Trip</span>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{incomingRequests.length}</span>
          </h3>

          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                      {req.sender_name ? req.sender_name[0] : 'S'}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{req.sender_name || 'Sender'}</h4>
                      <span className="text-[10px] text-slate-500">Rating: ⭐ {req.sender_rating || '5.0'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    PENDING
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Parcel Weight</span>
                    <span className="font-extrabold text-slate-900">3.5 kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Earn Payout</span>
                    <span className="font-extrabold text-emerald-700">₹450</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRejectRequest(req.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>

                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-black shadow-md transition active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Parcels & Handoff Actions */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-[#0f172a] flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-container" /> Accepted Parcels ({deliveries.length})
        </h3>

        {deliveries.length === 0 ? (
          <div className="rideel-card p-8 text-center text-xs text-slate-500">
            No parcel match requests accepted for this trip yet. Send requests will appear here when accepted.
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
