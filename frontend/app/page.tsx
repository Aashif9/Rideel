'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { User, Delivery, Trip } from '@/types';
import { POPULAR_ROUTES } from '@/lib/constants';
import {
  Package, Navigation, ShieldCheck, ArrowRight, Clock,
  MapPin, Sparkles, TrendingUp, ChevronRight, CheckCircle2, Truck
} from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
    apiServices.getDeliveries().then(d => {
      setActiveDeliveries(d.filter(del => del.status !== 'DELIVERED' && del.status !== 'CANCELLED'));
    });
    apiServices.getTrips().then(t => setUpcomingTrips(t.slice(0, 3)));
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-primary-fixed/10 blur-2xl"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            {user.is_kyc_verified ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Identity & KYC Verified</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-amber-200">Complete KYC to unlock full traveler earnings</span>
              </>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {user.full_name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-300 text-sm mt-1 font-normal">
            &ldquo;Your route. Their parcel. Same day.&rdquo; Connect with intercity travelers with empty luggage space.
          </p>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Link
              href="/send"
              className="bg-white text-primary hover:bg-surface-container-low p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg transition transform hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">Send a Parcel</div>
                  <div className="text-[11px] text-slate-500 font-normal">Find traveling couriers</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/trips"
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg transition transform hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">Post a Trip</div>
                  <div className="text-[11px] text-slate-900 font-medium">Earn money while traveling</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Deliveries Widget */}
      {activeDeliveries.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-container" /> Active Delivery Status
            </h2>
            <Link href="/deliveries" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeliveries.map((del) => (
              <div key={del.id} className="rideel-card p-5 space-y-4 hover:border-primary transition">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">ID: {del.id}</span>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {del.parcel?.origin || 'Origin'} → {del.parcel?.destination || 'Destination'}
                    </h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {del.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Est: <strong>{del.expected_delivery_time || '12:15 PM'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Traveler: <strong>{del.traveler?.full_name || 'Vikram Singh'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-500 font-medium">
                    OTP: <span className="font-mono font-extrabold text-primary bg-surface-container px-2 py-0.5 rounded">{del.pickup_otp}</span>
                  </div>
                  <Link
                    href={`/deliveries/${del.id}`}
                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-container transition shadow-xs"
                  >
                    Track Live
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Intercity Routes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Popular Courier Routes
            </h2>
            <p className="text-xs text-slate-500">Frequent same-day traveler trips with instant matching</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route, idx) => (
            <div key={idx} className="rideel-card rideel-card-interactive p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-surface-container text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                    Same Day Corridor
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    From ₹{route.avgPrice}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span>{route.origin}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span>{route.destination}</span>
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span>Distance: <strong>{route.distance}</strong></span>
                  <span>Avg Time: <strong>{route.avgTime}</strong></span>
                </div>
              </div>

              <Link
                href={`/send?origin=${encodeURIComponent(route.origin)}&dest=${encodeURIComponent(route.destination)}`}
                className="mt-4 w-full bg-surface-container hover:bg-primary hover:text-white text-primary text-xs font-bold py-2 rounded-xl text-center transition"
              >
                Send on this Route
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Trips */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" /> Available Traveler Trips
          </h2>
          <Link href="/send" className="text-xs font-bold text-primary hover:underline">
            Find All Travelers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="rideel-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-slate-700">{trip.travel_date}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {trip.available_capacity_kg} kg Capacity
                </span>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{trip.origin} → {trip.destination}</div>
                <div className="text-xs text-slate-500 mt-0.5">Departs: {trip.departure_time}</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="text-slate-600">Traveler: <strong>{trip.traveler?.full_name || 'Verified Traveler'}</strong></span>
                <span className="font-extrabold text-primary">₹{trip.price_per_kg}/kg</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
