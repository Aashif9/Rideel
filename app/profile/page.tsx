'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { User } from '@/types';
import {
  User as UserIcon, ShieldCheck, Truck, Wallet, Shield, AlertTriangle,
  ChevronRight, LogOut, FileText, Settings, HelpCircle, Star
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
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
      </div>
    </div>
  );
}
