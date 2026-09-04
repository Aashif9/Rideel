'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { User, Trip } from '@/types';
import { Truck, PlusCircle, Inbox, Wallet, ChevronRight, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TravelerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTravelerData();
  }, []);

  const loadTravelerData = async () => {
    setLoading(true);
    const currentUser = await apiServices.getCurrentUser();
    setUser(currentUser);

    // Ensure active_mode is traveler
    if (currentUser.active_mode !== 'traveler') {
      await apiServices.switchUserMode('traveler');
    }

    try {
      const allTrips = await apiServices.getTrips();
      const myTrips = allTrips.filter(t => t.traveler_id === currentUser.id);
      setTrips(myTrips);

      // Fetch pending incoming match requests count
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
        const pending = data.requests.filter((r: any) => r.status === 'PENDING').length;
        setPendingCount(pending);
      }
    } catch (e) {
      console.warn('Traveler data fetch warning:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#002b5c] via-[#003a7a] to-emerald-950 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              TRAVELER MODE
            </span>
            <h1 className="text-2xl font-black mt-2 tracking-tight">Earn While You Travel</h1>
            <p className="text-xs text-slate-300 font-medium mt-1 max-w-md">
              Monetize your unused luggage space by carrying parcels on your upcoming routes.
            </p>
          </div>

          <Link
            href="/trips"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Route</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/traveler/requests"
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold relative">
              <Inbox className="w-6 h-6" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition">Incoming Requests</h3>
              <p className="text-[10px] text-slate-400 font-medium">Accept or reject parcels</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/trips"
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition">My Posted Routes</h3>
              <p className="text-[10px] text-slate-400 font-medium">{trips.length} active routes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/wallet"
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 group-hover:text-indigo-700 transition">Traveler Wallet</h3>
              <p className="text-[10px] text-slate-400 font-medium">Payouts & Escrow</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Active Traveler Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">My Active Routes</h2>
          <Link href="/trips" className="text-xs font-bold text-emerald-700 hover:underline">View All</Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-700">No Posted Routes Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Post your upcoming travel route to start receiving parcel delivery requests.</p>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-extrabold px-6 py-2.5 rounded-2xl shadow-md hover:bg-emerald-700 transition"
            >
              <PlusCircle className="w-4 h-4" /> Post a Route Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-sm text-slate-900">{trip.origin} → {trip.destination}</span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {trip.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Departure</span>
                    <span className="font-extrabold text-slate-800">{trip.travel_date} ({trip.departure_time})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Capacity</span>
                    <span className="font-extrabold text-slate-800">{trip.available_capacity_kg} kg left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
