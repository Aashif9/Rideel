'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { MatchRequest, User } from '@/types';
import { Package, Clock, CheckCircle2, XCircle, User as UserIcon, ShieldCheck, ArrowRight, ArrowLeft, DollarSign, MapPin } from 'lucide-react';

export default function TravelerRequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const currentUser = await apiServices.getCurrentUser();
    setUser(currentUser);

    try {
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
      if (res.ok && data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.warn('Failed to fetch incoming match requests from REST API:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    setActionMessage(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rideel_access_token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/match-requests/${requestId}/accept` : `${baseUrl}/api/match-requests/${requestId}/accept`;

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: 'Parcel delivery request accepted! Booking is now active.' });
        loadRequests();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to accept request.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Network error accepting request.' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    setActionMessage(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rideel_access_token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/match-requests/${requestId}/reject` : `${baseUrl}/api/match-requests/${requestId}/reject`;

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: 'Parcel request declined.' });
        loadRequests();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to decline request.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Network error declining request.' });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-bold mt-3">Loading incoming parcel requests...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const pastRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/traveler')}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all border border-slate-200/80"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">Incoming Parcel Requests</h1>
            <p className="text-xs text-slate-500">Review and accept parcel delivery requests from senders along your route.</p>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-600 font-black">✕</button>
        </div>
      )}

      {/* Pending Requests Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span>Pending Decisions</span>
          <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">{pendingRequests.length}</span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-700">No Pending Requests</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You do not have any pending parcel requests at the moment. Post a new route to receive match requests from senders.
            </p>
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
              {/* Sender info & Match score */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {req.sender_name ? req.sender_name[0] : 'S'}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{req.sender_name || 'Sender'}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">Rating: ⭐ {req.sender_rating || '5.0'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    PENDING DECISION
                  </span>
                </div>
              </div>

              {/* Parcel Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Parcel Weight</span>
                  <span className="font-extrabold text-slate-800">3.5 kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Declared Value</span>
                  <span className="font-extrabold text-slate-800">₹2,500</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Payout</span>
                  <span className="font-extrabold text-emerald-600">₹450</span>
                </div>
              </div>

              {/* Buttons: Accept vs Reject */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  disabled={processingId === req.id}
                  onClick={() => handleReject(req.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Request</span>
                </button>

                <button
                  disabled={processingId === req.id}
                  onClick={() => handleAccept(req.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Request</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request History Section */}
      {pastRequests.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Past Request Decisions</h2>
          <div className="space-y-3">
            {pastRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-800 block">{req.sender_name || 'Sender'}</span>
                  <span className="text-[10px] text-slate-400">{new Date(req.created_at).toLocaleDateString()}</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${
                  req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
