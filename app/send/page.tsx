'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CITIES } from '@/lib/constants';
import { MapPin, Calendar, ArrowRight, ShieldCheck, UserCheck, ChevronRight } from 'lucide-react';

export default function SendParcelRoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [origin, setOrigin] = useState(searchParams.get('origin') || 'Vijayawada');
  const [destination, setDestination] = useState(searchParams.get('dest') || 'Hyderabad');
  const [travelDate, setTravelDate] = useState('2026-09-02');
  const [pickupPref, setPickupPref] = useState<'meet_traveler' | 'partner_point'>('meet_traveler');
  const [deliveryPref, setDeliveryPref] = useState<'meet_traveler' | 'partner_point'>('meet_traveler');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin === destination) {
      alert('Origin and Destination cities must be different intercity locations.');
      return;
    }
    // Navigate to Parcel Details step
    const query = new URLSearchParams({
      origin,
      destination,
      travelDate,
      pickupPref,
      deliveryPref
    }).toString();
    router.push(`/send/parcel-details?${query}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      {/* Progress Timeline Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b pb-4">
        <span className="text-primary font-extrabold flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span>
          Route & Handoff
        </span>
        <ChevronRight className="w-4 h-4" />
        <span>Parcel Details</span>
        <ChevronRight className="w-4 h-4" />
        <span>Match Traveler</span>
        <ChevronRight className="w-4 h-4" />
        <span>Payment & Escrow</span>
      </div>

      <div className="rideel-card p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Send a Parcel</h1>
          <p className="text-xs text-slate-500 mt-1">Select intercity origin, destination, and your handoff preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cities Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Origin City
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3.5 text-emerald-600" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Destination City
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3.5 text-primary" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Dispatch Date
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Pickup Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Pickup Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPickupPref('meet_traveler')}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  pickupPref === 'meet_traveler'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-extrabold text-sm">Meet Traveler Direct</div>
                <div className="text-[11px] font-normal opacity-80 mt-0.5">Meet at bus station or city hub</div>
              </button>

              <button
                type="button"
                onClick={() => setPickupPref('partner_point')}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  pickupPref === 'partner_point'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-extrabold text-sm">Partner Drop Hub</div>
                <div className="text-[11px] font-normal opacity-80 mt-0.5">Drop parcel at verified Rideel Hub</div>
              </button>
            </div>
          </div>

          {/* Delivery Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Delivery Handoff Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryPref('meet_traveler')}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  deliveryPref === 'meet_traveler'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-extrabold text-sm">Meet Receiver Direct</div>
                <div className="text-[11px] font-normal opacity-80 mt-0.5">Direct handover to receiver OTP</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryPref('partner_point')}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  deliveryPref === 'partner_point'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-extrabold text-sm">Partner Pickup Hub</div>
                <div className="text-[11px] font-normal opacity-80 mt-0.5">Receiver collects from local partner hub</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>Continue to Parcel Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
