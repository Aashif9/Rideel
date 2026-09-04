'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { Delivery } from '@/types';
import { Package, Clock, ShieldCheck, MapPin, ArrowRight, ArrowLeft, MessageSquare, KeyRound, ChevronRight } from 'lucide-react';

export default function DeliveriesPage() {
  const router = useRouter();
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
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto p-2 sm:p-4">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 border border-slate-200/80 shrink-0"
            aria-label="Go to Home"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Your Parcel Deliveries</h1>
            <p className="text-xs text-slate-500 font-medium">Track active shipments, verify handover OTPs, and view history</p>
          </div>
        </div>

        {/* Rapido Segmented Tab Filters */}
        <div className="flex bg-slate-100 rounded-2xl p-1.5 border border-slate-200/80 self-start shadow-inner">
          {(['active', 'completed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition-all transform active:scale-95 ${
                filter === tab
                  ? 'bg-[#002b5c] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-[#002b5c] border-t-amber-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 mt-3">Loading deliveries...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Package className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No {filter} deliveries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Send your first intercity parcel with a verified traveler today.</p>
          <Link
            href="/send"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-400/20 active:scale-95 transition-all transform uppercase tracking-wider"
          >
            <span>Send a Parcel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeliveries.map((del) => (
            <div key={del.id} className="bg-white rounded-3xl p-5 space-y-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 tracking-wider">ID: {del.id}</span>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5 mt-0.5">
                    <span>{del.parcel?.origin}</span>
                    <span className="text-amber-500 font-bold">→</span>
                    <span>{del.parcel?.destination}</span>
                  </h3>
                </div>
                <span className={`font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                  del.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  {del.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Traveler</span>
                  <span className="font-extrabold text-slate-900 truncate block mt-0.5">{del.traveler?.full_name || 'Vikram Singh'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Total Amount</span>
                  <span className="font-black text-[#002b5c] text-sm block mt-0.5">₹{del.total_amount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <Link
                  href={`/chat/${del.id}`}
                  className="text-xs font-extrabold text-slate-700 hover:text-[#002b5c] bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-2xl transition-all active:scale-95 flex items-center gap-1.5 border border-slate-200/60"
                >
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span>Chat with Traveler</span>
                </Link>

                <Link
                  href={`/deliveries/${del.id}`}
                  className="bg-[#002b5c] hover:bg-[#001d40] text-white text-xs font-black px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 group"
                >
                  <span>View & Track</span>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
