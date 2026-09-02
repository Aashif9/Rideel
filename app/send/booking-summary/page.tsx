'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { Delivery, Trip, Parcel } from '@/types';
import PaymentModal from '@/components/ui/PaymentModal';
import { ShieldCheck, Lock, CheckCircle2, ChevronRight, Package, Truck, Calendar } from 'lucide-react';

export default function BookingSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parcelId = searchParams.get('parcelId');
  const tripId = searchParams.get('tripId');

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (parcelId && tripId) {
      apiServices.createBooking(parcelId, tripId)
        .then(({ delivery }) => {
          setDelivery(delivery);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to generate booking summary');
          setLoading(false);
        });
    }
  }, [parcelId, tripId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500">Reserving traveler capacity slot & generating escrow summary...</p>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="max-w-xl mx-auto rideel-card p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-rose-700">Booking Reservation Error</h3>
        <p className="text-xs text-slate-500">{error || 'Could not finalize booking reservation.'}</p>
        <button
          onClick={() => router.push('/send')}
          className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl"
        >
          Return to Parcel Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      {/* Timeline Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b pb-4">
        <span className="text-slate-500">Route & Handoff</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-500">Parcel Details</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-500">Match Traveler</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary font-extrabold flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">4</span>
          Payment & Escrow
        </span>
      </div>

      <div className="rideel-card p-6 md:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400">BOOKING ID: {delivery.id}</span>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mt-0.5">Booking Summary & Escrow</h1>
          <p className="text-xs text-slate-500">Review final fees and proceed to secure escrow payment.</p>
        </div>

        {/* Route & Traveler Info */}
        <div className="p-4 bg-surface-container rounded-2xl border border-surface-container-high space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Intercity Route</span>
              <div className="font-extrabold text-slate-900 text-base">
                {delivery.parcel?.origin} → {delivery.parcel?.destination}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Departure</span>
              <div className="font-bold text-slate-900 text-xs">{delivery.trip?.travel_date} ({delivery.trip?.departure_time})</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={delivery.traveler?.profile_photo}
                alt={delivery.traveler?.full_name}
                className="w-10 h-10 rounded-full object-cover border border-primary"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {delivery.traveler?.full_name} <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500">Verified Courier Partner</div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-500">Weight: </span>
              <strong className="text-slate-900">{delivery.parcel?.weight_kg} kg</strong>
            </div>
          </div>
        </div>

        {/* Detailed Price Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Transparent Fee Breakdown</h3>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Traveler Delivery Fee ({delivery.parcel?.weight_kg} kg @ ₹{delivery.trip?.price_per_kg}/kg)</span>
              <span className="font-semibold text-slate-900">₹{delivery.delivery_fee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Rideel Platform Service Fee</span>
              <span className="font-semibold text-slate-900">₹{delivery.service_fee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Parcel Insurance & Protection</span>
              <span className="font-semibold text-slate-900">₹{delivery.insurance_fee}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base font-black text-primary">
              <span>Total Amount (Escrow)</span>
              <span>₹{delivery.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Escrow Security Guarantee */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">100% Rideel Escrow Protection</div>
            <div className="text-[11px] text-emerald-800 mt-0.5">
              Your money is safely held in Escrow and is ONLY released to the traveler AFTER you provide the Receiver OTP at destination.
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsPaymentOpen(true)}
          className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Proceed to Pay ₹{delivery.total_amount}</span>
        </button>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        delivery={delivery}
        onPaymentSuccess={() => {
          router.push(`/deliveries/${delivery.id}`);
        }}
      />
    </div>
  );
}
