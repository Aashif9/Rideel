'use client';

import React, { useState, useEffect } from 'react';
import { apiServices } from '@/services/apiServices';
import { KYCVerification } from '@/types';
import { ShieldCheck, CheckCircle2, XCircle, FileText, User } from 'lucide-react';

export default function AdminKYCPage() {
  const [kycList, setKycList] = useState<KYCVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServices.getAdminStats().then(data => {
      setKycList(data.kycVerifications);
      setLoading(false);
    });
  }, []);

  const handleAction = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    await apiServices.adminReviewKYC(id, status);
    const updated = await apiServices.getAdminStats();
    setKycList(updated.kycVerifications);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">KYC Document Approvals Queue</h1>
        <p className="text-xs text-slate-500">Review Aadhaar / Passport government IDs and traveler vehicle documents.</p>
      </div>

      <div className="rideel-card p-6 space-y-4">
        {kycList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No KYC submissions in queue</p>
        ) : (
          <div className="space-y-4">
            {kycList.map((kyc) => (
              <div key={kyc.id} className="p-4 bg-surface-container rounded-2xl border border-surface-container-high space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        Document Type: <span className="uppercase text-primary">{kyc.document_type}</span> ({kyc.document_number})
                      </div>
                      <div className="text-xs text-slate-500">User ID: {kyc.user_id}</div>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    kyc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {kyc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">ID Document Scan</span>
                    <a href={kyc.document_url} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">
                      View ID Document Image ↗
                    </a>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Selfie Match</span>
                    <a href={kyc.selfie_url} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">
                      View Selfie Image ↗
                    </a>
                  </div>
                </div>

                {kyc.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    <button
                      onClick={() => handleAction(kyc.id, 'REJECTED')}
                      className="bg-rose-100 text-rose-800 hover:bg-rose-200 px-4 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      Reject Submission
                    </button>
                    <button
                      onClick={() => handleAction(kyc.id, 'VERIFIED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Identity
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
