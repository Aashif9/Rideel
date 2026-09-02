'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import {
  LayoutDashboard, Users, Package, ShieldCheck, DollarSign,
  AlertTriangle, CheckCircle2, Search, ArrowRight, Eye, Shield
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServices.getAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" /> Platform Control Center
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Admin Master Dashboard</h1>
          <p className="text-xs text-slate-500">Live operational metrics, database transactions, KYC queue & disputes.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/kyc"
            className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-container transition shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> KYC Approvals
          </Link>
          <Link
            href="/admin/disputes"
            className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition shadow-xs flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" /> Disputes Queue
          </Link>
        </div>
      </div>

      {/* Top Admin KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Users</span>
          <div className="text-3xl font-black text-slate-900">{stats.totalUsers}</div>
          <span className="text-[11px] text-emerald-700 font-bold">{stats.activeTravelers} Active Travelers</span>
        </div>

        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Deliveries In-Transit</span>
          <div className="text-3xl font-black text-primary">{stats.activeDeliveries}</div>
          <span className="text-[11px] text-slate-500 font-medium">Real-time GPS tracking</span>
        </div>

        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Platform Commission Earned</span>
          <div className="text-3xl font-black text-emerald-700">₹{stats.todayRevenue}</div>
          <span className="text-[11px] text-slate-500 font-medium">12% Rideel service cut</span>
        </div>

        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending KYC Submissions</span>
          <div className="text-3xl font-black text-amber-600">
            {stats.kycVerifications.filter((k: any) => k.status === 'PENDING').length}
          </div>
          <span className="text-[11px] text-amber-700 font-bold">Requires review</span>
        </div>
      </div>

      {/* Live Deliveries Database View */}
      <div className="rideel-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-primary">Live Database Deliveries Ledger</h3>
          <span className="text-xs text-slate-500 font-medium">{stats.deliveries.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2">Delivery ID</th>
                <th className="py-2">Route</th>
                <th className="py-2">Sender</th>
                <th className="py-2">Traveler</th>
                <th className="py-2">Escrow Total</th>
                <th className="py-2">Commission</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {stats.deliveries.map((del: any) => (
                <tr key={del.id} className="hover:bg-surface-container-low">
                  <td className="py-3 font-mono font-bold text-primary">{del.id}</td>
                  <td className="py-3 font-bold">{del.parcel?.origin || 'Vijayawada'} → {del.parcel?.destination || 'Hyderabad'}</td>
                  <td className="py-3">{del.sender?.full_name || 'Aarav Mehta'}</td>
                  <td className="py-3">{del.traveler?.full_name || 'Vikram Singh'}</td>
                  <td className="py-3 font-bold text-slate-900">₹{del.total_amount}</td>
                  <td className="py-3 font-extrabold text-emerald-700">₹{del.service_fee}</td>
                  <td className="py-3">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {del.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
