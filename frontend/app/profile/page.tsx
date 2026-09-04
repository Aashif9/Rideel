'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { User } from '@/types';
import {
  User as UserIcon, ShieldCheck, Truck, Wallet, Shield, AlertTriangle,
  ChevronRight, LogOut, FileText, Settings, HelpCircle, Star, ArrowLeft
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in p-2 sm:p-4">
      {/* Top Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 border border-slate-200/80 shrink-0"
          aria-label="Go to Home"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">User Account</h1>
          <p className="text-xs text-slate-500 font-medium">KYC verification, trust badges, and settings</p>
        </div>
      </div>
      {/* Profile Header */}
      <div className="rideel-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user.profile_photo}
            alt={user.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{user.full_name}</h1>
              {user.is_kyc_verified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <p className="text-xs text-slate-500">{user.email} • {user.phone}</p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-1">
              <span className="flex items-center gap-1 text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {user.rating}
              </span>
              <span>•</span>
              <span>{user.completed_deliveries} Deliveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="rideel-card divide-y divide-slate-100 overflow-hidden">
        <Link href="/profile/kyc" className="p-4 flex items-center justify-between hover:bg-surface-container transition">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">Identity & KYC Verification</div>
              <div className="text-xs text-slate-500">Aadhaar / Passport document verification status</div>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            user.is_kyc_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {user.is_kyc_verified ? 'VERIFIED' : 'ACTION NEEDED'}
          </span>
        </Link>

        <Link href="/wallet" className="p-4 flex items-center justify-between hover:bg-surface-container transition">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-bold text-slate-900">Wallet & Earnings</div>
              <div className="text-xs text-slate-500">Escrow ledger, balance payouts & bank withdrawal</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link href="/safety" className="p-4 flex items-center justify-between hover:bg-surface-container transition">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">Safety Center & Emergency Support</div>
              <div className="text-xs text-slate-500">OTP protection rules, prohibited items, insurance</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link href="/safety/dispute" className="p-4 flex items-center justify-between hover:bg-surface-container transition">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">Report Issue / Claims</div>
              <div className="text-xs text-slate-500">Open dispute ticket for lost or damaged parcels</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link href="/login" className="p-4 flex items-center justify-between hover:bg-rose-50/50 transition">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-rose-600" />
            <div>
              <div className="text-sm font-bold text-rose-700">Log Out / Switch Member Account</div>
              <div className="text-xs text-rose-500">Sign in with phone number code or switch active role</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-400" />
        </Link>
      </div>
    </div>
  );
}
