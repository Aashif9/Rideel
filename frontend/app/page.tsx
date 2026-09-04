'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { User, Delivery, Trip } from '@/types';
import {
  Search, MapPin, Bell, Package, Navigation, Users, Building,
  ArrowRight, ShieldCheck, Clock, Truck, ChevronRight, Wallet, CheckCircle2,
  User as UserIcon
} from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [selectedCity, setSelectedCity] = useState('Chennai, TN');

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
    apiServices.getDeliveries().then(d => {
      setActiveDeliveries(d);
    });
  }, []);

  const userName = user?.full_name?.split(' ')[0] || 'Aarav';

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8fafc] pb-24 font-sans text-slate-900 animate-in fade-in select-none">
      
      {/* 1. TOP BRAND HEADER BAR */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#002b5c] text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
            R
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-wide text-[#002b5c] leading-tight">RIDEEL</div>
            <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
              PEOPLE • PARCELS • POSSIBILITIES
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell with Badge */}
          <div className="relative cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition">
              <Bell className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
              3
            </span>
          </div>

          {/* Profile Avatar */}
          <Link href="/profile">
            <img
              src={user?.profile_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#002b5c] shadow-xs"
            />
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 2. GREETING HEADER */}
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight flex items-center gap-2">
            Hello, {userName} 👋
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Send parcels. Travel smart. Earn together.
          </p>
        </div>

        {/* 3. LOCATION SEARCH BAR */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-3 px-1">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-[#002b5c]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-bold text-xs text-[#002b5c] focus:outline-none cursor-pointer"
            >
              <option value="Chennai, TN">Chennai, TN</option>
              <option value="Hyderabad, TS">Hyderabad, TS</option>
              <option value="Vijayawada, AP">Vijayawada, AP</option>
              <option value="Bangalore, KA">Bangalore, KA</option>
              <option value="Mumbai, MH">Mumbai, MH</option>
            </select>
          </div>
        </div>

        {/* 4. FOUR FEATURE ACTION CARDS GRID */}
        <div className="grid grid-cols-4 gap-2.5">
          <Link
            href="/send"
            className="bg-blue-50/80 hover:bg-blue-100/80 border border-blue-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-800 leading-tight">Send a Parcel</span>
          </Link>

          <Link
            href="/trips"
            className="bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-800 leading-tight">Book a Trip</span>
          </Link>

          <Link
            href="/send/travelers"
            className="bg-purple-50/80 hover:bg-purple-100/80 border border-purple-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-800 leading-tight">Find Travelers</span>
          </Link>

          <Link
            href="/business"
            className="bg-amber-50/80 hover:bg-amber-100/80 border border-amber-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-800 leading-tight">Business B2B</span>
          </Link>
        </div>

        {/* 5. SAME DAY PROMO BANNER */}
        <div className="bg-gradient-to-r from-[#002b5c] via-[#003d82] to-[#001f44] text-white rounded-3xl p-5 shadow-md relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1 max-w-[220px]">
            <h2 className="text-lg font-black tracking-tight leading-tight">
              Same Day.<br />People-to-People.<br />Across Cities.
            </h2>
            <p className="text-[10px] font-bold text-blue-200 opacity-90 pt-1">
              Safe • Trusted • Affordable
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-amber-600/90 rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 border border-amber-400/40">
              <Package className="w-8 h-8 text-white" />
            </div>
            <Link
              href="/send"
              className="w-9 h-9 rounded-full bg-white text-[#002b5c] flex items-center justify-center shadow-md hover:scale-105 transition mt-1"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 6. ACTIVE DELIVERIES SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0f172a]">Active Deliveries</h2>
            <Link href="/deliveries" className="text-xs font-extrabold text-[#002b5c] hover:underline flex items-center gap-0.5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Delivery Card 1: In Transit */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#002b5c] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block leading-tight">RD399812</span>
                  <div className="font-extrabold text-xs text-slate-900">Jaipur → Chennai</div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                In Transit
              </span>
            </div>

            {/* 4-Step Progress Tracker Bar */}
            <div className="pt-1 px-1">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-3 right-3 top-1.5 h-0.5 bg-slate-200 -z-0"></div>
                <div className="absolute left-3 w-1/3 top-1.5 h-0.5 bg-emerald-500 -z-0"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20"></div>
                  <span className="text-[9px] font-bold text-slate-700 mt-1">Picked</span>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-600/20"></div>
                  <span className="text-[9px] font-bold text-blue-600 mt-1">In Transit</span>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white"></div>
                  <span className="text-[9px] font-medium text-slate-400 mt-1">Out for Delivery</span>
                </div>
                {/* Step 4 */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white"></div>
                  <span className="text-[9px] font-medium text-slate-400 mt-1">Delivered</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>12 May, 5:20 PM</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Priya Reddy</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Delivery Card 2: Delivered */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block leading-tight">RD498412</span>
                  <div className="font-extrabold text-xs text-slate-900">Delhi → Bangalore</div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                Delivered
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10 May, 8:45 PM</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Arjun Kumar</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 7. WALLET BALANCE CARD */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0f172a]">Wallet Balance</h2>
            <Link href="/wallet" className="text-xs font-extrabold text-[#002b5c] hover:underline flex items-center gap-0.5">
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available Funds</span>
                <div className="text-2xl font-black text-[#0f172a]">₹2,580</div>
              </div>
            </div>

            <Link
              href="/wallet"
              className="bg-[#002b5c] hover:bg-[#001f44] text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-xs transition"
            >
              Top Up
            </Link>
          </div>
        </div>

        {/* 8. EARN WHILE YOU TRAVEL BANNER */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-100 rounded-3xl p-4 flex items-center justify-between">
          <div className="space-y-1 max-w-[200px]">
            <h3 className="text-sm font-extrabold text-[#002b5c]">Earn While You Travel</h3>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Become a verified traveler and earn by carrying parcels.
            </p>
          </div>

          <Link
            href="/trips"
            className="w-10 h-10 rounded-full bg-[#002b5c] text-white flex items-center justify-center shadow-md hover:scale-105 transition shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 9. BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-slate-100 px-6 py-2 flex items-center justify-between z-50 shadow-lg">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-[#002b5c] font-black text-[10px]">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#002b5c]"></span>
          </div>
          <span>Home</span>
        </Link>

        <Link href="/send" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 font-bold text-[10px]">
          <Package className="w-5 h-5" />
          <span>Send</span>
        </Link>

        <Link href="/trips" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 font-bold text-[10px]">
          <Navigation className="w-5 h-5" />
          <span>Trips</span>
        </Link>

        <Link href="/deliveries" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 font-bold text-[10px]">
          <Truck className="w-5 h-5" />
          <span>Deliveries</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 font-bold text-[10px]">
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>

    </div>
  );
}
