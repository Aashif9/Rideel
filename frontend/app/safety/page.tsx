'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PROHIBITED_ITEMS } from '@/lib/constants';
import { Shield, KeyRound, AlertTriangle, PhoneCall, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

export default function SafetyCenterPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in p-2 sm:p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 border border-slate-200/80 shrink-0"
          aria-label="Go to Home"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Safety & Trust Center</h1>
          <p className="text-xs text-slate-500 font-medium">Security protocols, OTP protection, prohibited items, and insurance coverage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OTP Protection */}
        <div className="rideel-card p-5 space-y-3">
          <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center text-primary font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Double OTP Handover Protection</h3>
          <p className="text-xs text-slate-600">
            Every delivery requires a 6-digit Pickup OTP from sender and a 6-digit Delivery OTP from receiver before escrow funds are released.
          </p>
        </div>

        {/* Insurance */}
        <div className="rideel-card p-5 space-y-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Parcel Insurance Coverage</h3>
          <p className="text-xs text-slate-600">
            Opt-in parcel protection provides financial coverage up to ₹10,000 for declared parcel value against loss or transit damage.
          </p>
        </div>
      </div>

      {/* Prohibited Items List */}
      <div className="rideel-card p-6 space-y-4">
        <h3 className="text-base font-extrabold text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" /> Prohibited & Illegal Cargo Categories
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          {PROHIBITED_ITEMS.map((item, idx) => (
            <li key={idx} className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rideel-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary-container text-white">
        <div>
          <h3 className="font-extrabold text-base">Have an Active Transit Dispute?</h3>
          <p className="text-xs text-slate-300">Submit evidence to our 24/7 dispute resolution team.</p>
        </div>
        <Link
          href="/safety/dispute"
          className="bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-extrabold text-xs hover:bg-amber-300 transition shrink-0"
        >
          Open Dispute Ticket
        </Link>
      </div>
    </div>
  );
}
