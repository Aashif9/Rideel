'use client';

import React, { useState, useEffect } from 'react';
import { apiServices } from '@/services/apiServices';
import { Dispute } from '@/types';
import { AlertTriangle, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    apiServices.getAdminStats().then(data => {
      setDisputes(data.disputes);
    });
  }, []);

  const handleResolve = async (id: string, resolution: string) => {
    await apiServices.adminResolveDispute(id, resolution);
    const updated = await apiServices.getAdminStats();
    setDisputes(updated.disputes);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Dispute Resolution Queue</h1>
        <p className="text-xs text-slate-500">Arbitrate parcel claims, order refunds, and unfreeze escrow payouts.</p>
      </div>

      <div className="rideel-card p-6 space-y-4">
        {disputes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No open dispute claims logged</p>
        ) : (
          <div className="space-y-4">
            {disputes.map((d) => (
              <div key={d.id} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span className="font-extrabold text-slate-900 text-sm">{d.issue_type}</span>
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {d.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border">
                  <strong>Description:</strong> {d.description}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200">
                  <button
                    onClick={() => handleResolve(d.id, 'Refunded 100% Escrow to Sender')}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    Issue Full Refund to Sender
                  </button>
                  <button
                    onClick={() => handleResolve(d.id, 'Released Escrow to Traveler after Verification')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    Release Payout to Traveler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
