'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { Delivery } from '@/types';
import { AlertTriangle, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportIssuePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deliveryId = searchParams.get('deliveryId') || 'RD784521';

  const [issueType, setIssueType] = useState<any>('Damaged Parcel');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <Link href="/safety" className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Safety Center
      </Link>

      <div className="rideel-card p-6 md:p-8 space-y-6">
        <div>
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Report Delivery Issue / Dispute</h1>
          <p className="text-xs text-slate-500">File a claim for lost, damaged, or delayed parcels.</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-extrabold text-emerald-900">Dispute Ticket Filed Successfully</h3>
            <p className="text-xs text-emerald-800">
              Dispute ticket for delivery <strong>{deliveryId}</strong> has been logged. Escrow release is frozen while Rideel Admin reviews evidence.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Delivery ID Reference</label>
              <input
                type="text"
                disabled
                value={deliveryId}
                className="w-full bg-slate-100 border rounded-xl p-3 text-xs font-mono font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Issue Category</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-surface-container-low border rounded-xl p-3 text-xs font-bold text-slate-900"
              >
                <option value="Lost Parcel">Lost Parcel</option>
                <option value="Damaged Parcel">Damaged Parcel</option>
                <option value="Wrong Receiver">Wrong Receiver</option>
                <option value="Traveler Problem">Traveler Problem</option>
                <option value="Payment Issue">Payment Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Issue Description & Evidence Details</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full bg-surface-container-low border rounded-xl p-3 text-xs text-slate-900"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Upload Photo Evidence (Optional)</div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-extrabold text-sm shadow-md"
            >
              Submit Dispute Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
