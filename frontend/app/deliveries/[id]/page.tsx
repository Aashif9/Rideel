'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { Delivery } from '@/types';
import MapComponent from '@/components/tracking/MapComponent';
import OTPModal from '@/components/tracking/OTPModal';
import {
  Package, Truck, CheckCircle2, KeyRound, ShieldCheck,
  MessageSquare, AlertTriangle, ArrowLeft, Clock, MapPin, DollarSign, Star, Lock, Eye, EyeOff
} from 'lucide-react';

import { useLiveLocation } from '@/hooks/useLiveLocation';

export default function DeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.id as string;

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpModalType, setOtpModalType] = useState<'pickup' | 'delivery' | null>(null);

  const [revealPickupOtp, setRevealPickupOtp] = useState(false);
  const [revealDeliveryOtp, setRevealDeliveryOtp] = useState(false);

  // Real-Time Socket.IO GPS Live Tracking Hook
  const { currentLocation, isLive, isStale, lastUpdatedAgo, error: gpsError } = useLiveLocation({
    deliveryId,
    role: 'sender',
  });

  useEffect(() => {
    if (deliveryId) {
      apiServices.getDeliveries().then(deliveries => {
        const found = deliveries.find(d => d.id === deliveryId);
        setDelivery(found || null);
        setLoading(false);
      });
    }
  }, [deliveryId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="max-w-xl mx-auto rideel-card p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Delivery Record Not Found</h3>
        <button onClick={() => router.push('/deliveries')} className="bg-primary text-white text-xs font-bold px-6 py-2 rounded-xl">
          Back to Deliveries
        </button>
      </div>
    );
  }

  const timelineSteps = [
    { title: 'Booking Confirmed', status: 'BOOKED', done: true },
    { title: 'Escrow Payment Held', status: 'ACCEPTED', done: delivery.status !== 'BOOKED' },
    { title: 'Parcel Picked Up (Pickup OTP Verified)', status: 'PICKED_UP', done: ['PICKED_UP', 'IN_TRANSIT', 'DELIVERY_PENDING', 'DELIVERED'].includes(delivery.status) },
    { title: 'In Transit along Intercity Highway', status: 'IN_TRANSIT', done: ['IN_TRANSIT', 'DELIVERY_PENDING', 'DELIVERED'].includes(delivery.status) },
    { title: 'Delivered (Receiver OTP Verified)', status: 'DELIVERED', done: delivery.status === 'DELIVERED' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/deliveries')}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 border border-slate-200/80 shrink-0"
            aria-label="Back to Deliveries"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#0f172a] tracking-tight">Shipment Tracking</h1>
            <span className="text-[10px] font-mono font-extrabold text-slate-400">ID: {delivery.id}</span>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#0f172a] flex items-center gap-1.5">
              <span>{delivery.parcel?.origin}</span>
              <span className="text-amber-500 font-bold">→</span>
              <span>{delivery.parcel?.destination}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Parcel: {delivery.parcel?.description} ({delivery.parcel?.weight_kg} kg)
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start border border-emerald-200 shadow-xs">
            {delivery.status.replace('_', ' ')}
          </span>
        </div>

        {/* Real-Time Live GPS Google Map */}
        <MapComponent
          origin={delivery.parcel?.origin || 'Vijayawada'}
          destination={delivery.parcel?.destination || 'Hyderabad'}
          travelerName={delivery.traveler?.full_name || 'Vikram Singh'}
          status={delivery.status}
          eta={delivery.expected_delivery_time || '12:15 PM'}
          currentLat={currentLocation?.latitude}
          currentLng={currentLocation?.longitude}
          isLive={isLive}
          isStale={isStale}
          speed={currentLocation?.speed}
          accuracy={currentLocation?.accuracy}
          lastUpdatedAgo={lastUpdatedAgo}
        />

        {/* Sender Security OTP Box (2 OTPs: Pickup & Delivery) */}
        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Sender Verification OTPs</span>
            </h3>
            <span className="text-[10px] text-amber-800 font-bold">Share with traveler at handover</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Pickup OTP (Start of Ride) */}
            <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Pickup OTP (Start of Ride)</span>
                <span className="text-base font-mono font-black text-slate-900 tracking-wider">
                  {revealPickupOtp ? delivery.pickup_otp : '••••••'}
                </span>
              </div>
              <button
                onClick={() => setRevealPickupOtp(!revealPickupOtp)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                {revealPickupOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* 2. Delivery OTP (Package Handover Time) */}
            <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Receiver OTP (Package Arrival)</span>
                <span className="text-base font-mono font-black text-slate-900 tracking-wider">
                  {revealDeliveryOtp ? delivery.delivery_otp : '••••••'}
                </span>
              </div>
              <button
                onClick={() => setRevealDeliveryOtp(!revealDeliveryOtp)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                {revealDeliveryOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons: Chat & OTP verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={`/chat/${delivery.id}`}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 p-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-200/60"
          >
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>Chat with Traveler</span>
          </Link>

          {delivery.status === 'ACCEPTED' || delivery.status === 'PICKUP_PENDING' ? (
            <button
              onClick={() => setOtpModalType('pickup')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 p-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-md shadow-amber-400/20 uppercase tracking-wider"
            >
              <KeyRound className="w-4 h-4 text-slate-950" />
              <span>Show Pickup OTP</span>
            </button>
          ) : delivery.status === 'IN_TRANSIT' || delivery.status === 'DELIVERY_PENDING' ? (
            <button
              onClick={() => setOtpModalType('delivery')}
              className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all transform active:scale-95 shadow-md uppercase tracking-wider"
            >
              <KeyRound className="w-4 h-4 text-white" />
              <span>Show Receiver OTP</span>
            </button>
          ) : delivery.status === 'DELIVERED' ? (
            <Link
              href={`/safety/dispute?deliveryId=${delivery.id}`}
              className="bg-amber-50 text-amber-900 border border-amber-200 p-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-amber-100 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Report Issue / Rate</span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Vertical Status Timeline */}
      <div className="rideel-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-primary">Delivery Status Timeline</h3>
        <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step.done ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-500'
              }`}>
                {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {step.done ? 'Completed stage' : 'Pending next handover milestone'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OTP Display & Verification Modals */}
      {otpModalType === 'pickup' && (
        <OTPModal
          isOpen={true}
          onClose={() => setOtpModalType(null)}
          title="Pickup Verification OTP"
          subtitle="Provide this OTP code to the traveler when handing over the parcel at pickup."
          expectedOtp={delivery.pickup_otp}
          isTraveler={false}
          onVerify={async () => ({ success: true, message: 'Pickup code displayed.' })}
        />
      )}

      {otpModalType === 'delivery' && (
        <OTPModal
          isOpen={true}
          onClose={() => setOtpModalType(null)}
          title="Receiver Delivery OTP"
          subtitle="Receiver gives this OTP to traveler upon receiving the parcel at destination."
          expectedOtp={delivery.delivery_otp}
          isTraveler={false}
          onVerify={async () => ({ success: true, message: 'Delivery code displayed.' })}
        />
      )}
    </div>
  );
}
