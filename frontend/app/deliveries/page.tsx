'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { Delivery } from '@/types';
import { Package, Clock, ShieldCheck, MapPin, ArrowRight, MessageSquare, KeyRound, ChevronRight } from 'lucide-react';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServices.getDeliveries().then(d => {
      setDeliveries(d);
      setLoading(false);
    });
  }, []);

  const filteredDeliveries = deliveries.filter(d => {
    if (filter === 'active') return d.status !== 'DELIVERED' && d.status !== 'CANCELLED';
    if (filter === 'completed') return d.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Your Parcel Deliveries</h1>
          <p className="text-xs text-slate-500">Track active shipments, verify handover OTPs, and view history</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-surface-container rounded-xl p-1 border border-surface-container-high self-start">
          {(['active', 'completed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                filter === tab
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="rideel-card p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No {filter} deliveries found</h3>
          <p className="text-xs text-slate-500">Send your first intercity parcel with a verified traveler today.</p>
          <Link
            href="/send"
            className="inline-block bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container transition"
          >
            Send a Parcel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeliveries.map((del) => (
            <div key={del.id} className="rideel-card p-5 space-y-4 hover:border-primary transition">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400">ID: {del.id}</span>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {del.parcel?.origin} → {del.parcel?.destination}
                  </h3>
                </div>
                <span className={`font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider ${
                  del.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {del.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-surface-container p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Traveler</span>
                  <span className="font-bold text-slate-900">{del.traveler?.full_name || 'Vikram Singh'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="font-extrabold text-primary">₹{del.total_amount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/chat/${del.id}`}
                  className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-primary-container" /> Chat with Traveler
                </Link>

                <Link
                  href={`/deliveries/${del.id}`}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-container transition shadow-xs flex items-center gap-1"
                >
                  <span>View & Track</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
