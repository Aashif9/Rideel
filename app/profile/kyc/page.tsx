'use client';

import React, { useState, useEffect } from 'react';
import { apiServices } from '@/services/apiServices';
import { User } from '@/types';
import { ShieldCheck, Upload, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function KYCVerificationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [docType, setDocType] = useState('aadhaar');
  const [docNumber, setDocNumber] = useState('XXXX-XXXX-4819');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiServices.submitKYC(
      docType as any,
      docNumber,
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
    );
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <Link href="/profile" className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>

      <div className="rideel-card p-6 md:p-8 space-y-6">
        <div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary">KYC Identity Verification</h1>
          <p className="text-xs text-slate-500">Government ID & Selfie submission for platform trust & safety.</p>
        </div>

        {submitted || user?.is_kyc_verified ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-extrabold text-emerald-900">KYC Verification Submitted / Active</h3>
            <p className="text-xs text-emerald-800">
              Your government ID documents are verified. You have full access to send parcels and accept traveler delivery requests.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-surface-container-low border rounded-xl p-3 text-xs font-bold text-slate-900"
              >
                <option value="aadhaar">Aadhaar Card (Unique Identification)</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Document Reference Number</label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full bg-surface-container-low border rounded-xl p-3 text-xs font-bold"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Upload Front & Back Image of ID</div>
              <div className="text-[11px] text-slate-400">JPG, PNG or PDF up to 5MB</div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-extrabold text-sm shadow-md"
            >
              Submit KYC Documents for Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
