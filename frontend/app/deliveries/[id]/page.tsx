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
  MessageSquare, AlertTriangle, ArrowLeft, Clock, MapPin, DollarSign, Star
} from 'lucide-react';

export default function DeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.id as string;

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpModalType, setOtpModalType] = useState<'pickup' | 'delivery' | null>(null);

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
    { title: 'Parcel Picked Up (OTP Verified)', status: 'PICKED_UP', done: ['PICKED_UP', 'IN_TRANSIT', 'DELIVERY_PENDING', 'DELIVERED'].includes(delivery.status) },
    { title: 'In Transit along Intercity Highway', status: 'IN_TRANSIT', done: ['IN_TRANSIT', 'DELIVERY_PENDING', 'DELIVERED'].includes(delivery.status) },
    { title: 'Delivered (Receiver OTP Verified)', status: 'DELIVERED', done: delivery.status === 'DELIVERED' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/deliveries')}
          className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Deliveries
        </button>
        <span className="text-xs font-mono font-bold text-slate-400">ID: {delivery.id}</span>
      </div>

      {/* Header Info */}
      <div className="rideel-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary">
              {delivery.parcel?.origin} → {delivery.parcel?.destination}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Parcel: {delivery.parcel?.description} ({delivery.parcel?.weight_kg} kg)
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start">
            {delivery.status.replace('_', ' ')}
          </span>
        </div>

        {/* Live GPS Simulation Map */}
        <MapComponent
          origin={delivery.parcel?.origin || 'Vijayawada'}
          destination={delivery.parcel?.destination || 'Hyderabad'}
          travelerName={delivery.traveler?.full_name || 'Vikram Singh'}
          status={delivery.status}
          eta={delivery.expected_delivery_time || '12:15 PM'}
        />

        {/* Action Buttons: Chat & OTP verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={`/chat/${delivery.id}`}
            className="bg-surface-container hover:bg-surface-container-high text-primary p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <MessageSquare className="w-4 h-4 text-primary-container" />
            <span>Chat with Traveler</span>
          </Link>

          {delivery.status === 'ACCEPTED' || delivery.status === 'PICKUP_PENDING' ? (
            <button
              onClick={() => setOtpModalType('pickup')}
              className="bg-primary text-white p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-primary-container transition shadow-md"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Show Pickup OTP</span>
            </button>
          ) : delivery.status === 'IN_TRANSIT' || delivery.status === 'DELIVERY_PENDING' ? (
            <button
              onClick={() => setOtpModalType('delivery')}
              className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-md"
            >
              <KeyRound className="w-4 h-4" />
              <span>Show Receiver Delivery OTP</span>
            </button>
          ) : delivery.status === 'DELIVERED' ? (
            <Link
              href={`/safety/dispute?deliveryId=${delivery.id}`}
              className="bg-amber-50 text-amber-800 border border-amber-200 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
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
          subtitle="Provide this OTP code to the traveler when handing over the parcel."
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
