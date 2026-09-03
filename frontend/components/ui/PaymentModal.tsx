'use client';

import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, Sparkles, X } from 'lucide-react';
import { apiServices } from '@/services/apiServices';
import { Delivery } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  delivery,
  onPaymentSuccess
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      await apiServices.processDemoPayment(delivery.id);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1500);
    } catch (e) {
      console.error('Payment failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> DEMO PAYMENT GATEWAY
          </span>
          <span className="text-xs text-slate-500 font-medium">Razorpay Simulation</span>
        </div>

        <h3 className="text-xl font-black text-primary mb-1">RIDEEL Escrow Payment</h3>
        <p className="text-xs text-slate-500 mb-4">Funds are securely locked in escrow until successful OTP delivery verification.</p>

        {/* Detailed Financial Breakdown */}
        <div className="bg-surface-container p-4 rounded-2xl space-y-2 mb-6 border border-surface-container-high">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Traveler Delivery Fee</span>
            <span className="font-semibold text-slate-900">₹{delivery.delivery_fee}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Rideel Platform Service Fee</span>
            <span className="font-semibold text-slate-900">₹{delivery.service_fee}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Parcel Insurance (Opted In)</span>
            <span className="font-semibold text-slate-900">₹{delivery.insurance_fee}</span>
          </div>
          <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between text-sm font-extrabold text-primary">
            <span>Total Escrow Charge</span>
            <span className="text-lg">₹{delivery.total_amount}</span>
          </div>
        </div>

        {/* Payment Methods Simulation */}
        <div className="space-y-2 mb-6">
          <div className="p-3 border-2 border-primary rounded-xl flex items-center justify-between bg-primary-fixed/20">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs font-bold text-slate-900">UPI / GPay / PhonePe / Cards</div>
                <div className="text-[10px] text-slate-500">Simulated Instant Approval</div>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Escrow Payment Held Successfully!
          </div>
        ) : (
          <button
            onClick={handleSimulatePayment}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Processing Escrow...' : `Pay ₹${delivery.total_amount} (Demo Payment)`}
          </button>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 128-bit Encrypted Escrow Protection
        </div>
      </div>
    </div>
  );
}
