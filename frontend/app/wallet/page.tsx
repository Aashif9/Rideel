'use client';

import React, { useState, useEffect } from 'react';
import { apiServices } from '@/services/apiServices';
import { User, WalletTransaction } from '@/types';
import { Wallet, ArrowDownRight, Lock, CheckCircle2, Building2, Sparkles, X } from 'lucide-react';

export default function WalletPage() {
  const [user, setUser] = useState<User | null>(null);
  const [walletData, setWalletData] = useState<{ available: number; escrow: number; transactions: WalletTransaction[] }>({
    available: 0,
    escrow: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [bankDetails, setBankDetails] = useState('HDFC Bank - A/C XXXX4819');
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiServices.getCurrentUser().then(u => {
      setUser(u);
      apiServices.getWalletData(u.id).then(data => {
        setWalletData(data);
        setLoading(false);
      });
    });
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiServices.requestWithdrawal(withdrawAmount, bankDetails);
    if (res.success) {
      setMessage(res.message);
      if (user) {
        const updated = await apiServices.getWalletData(user.id);
        setWalletData(updated);
      }
      setTimeout(() => {
        setShowWithdrawModal(false);
        setMessage('');
      }, 1500);
    } else {
      setMessage(res.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Wallet & Financials</h1>
        <p className="text-xs text-slate-500">Track escrow balance, delivery earnings payouts, and bank withdrawals.</p>
      </div>

      {/* Wallet Card Hero */}
      <div className="bg-gradient-to-br from-primary via-primary-container to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-300" />
            <span className="font-bold text-sm text-slate-200">Rideel Financial Balance</span>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
            INR (₹)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">Available Balance</div>
            <div className="text-3xl font-black text-white mt-1">₹{walletData.available}</div>
            <div className="text-[11px] text-emerald-300 font-medium mt-0.5">Ready for instant bank payout</div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">Escrow Locked</div>
            <div className="text-3xl font-black text-amber-300 mt-1">₹{walletData.escrow}</div>
            <div className="text-[11px] text-amber-200 font-medium mt-0.5">Held during active deliveries</div>
          </div>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={walletData.available <= 0}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowDownRight className="w-4 h-4 stroke-[3px]" />
          <span>Withdraw Balance to Bank</span>
        </button>
      </div>

      {/* Transaction History Ledger */}
      <div className="rideel-card p-6 space-y-4">
        <h3 className="text-base font-extrabold text-primary">Transaction History</h3>

        <div className="space-y-3">
          {walletData.transactions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No transaction history yet</p>
          ) : (
            walletData.transactions.map((txn) => (
              <div key={txn.id} className="p-3.5 bg-surface-container rounded-xl border border-surface-container-high flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{txn.description}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{new Date(txn.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className={`font-extrabold text-sm ${
                    txn.type === 'EARNING_CREDIT' ? 'text-emerald-700' : 'text-slate-900'
                  }`}>
                    {txn.type === 'EARNING_CREDIT' ? '+' : ''}₹{txn.amount}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {txn.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high relative">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-primary mb-1">Withdraw Funds</h3>
            <p className="text-xs text-slate-500 mb-4">Transfer available balance directly to linked bank account.</p>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount to Withdraw (₹)</label>
                <input
                  type="number"
                  max={walletData.available}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-container-low border rounded-xl p-3 text-lg font-extrabold text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Linked Bank Account</label>
                <input
                  type="text"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className="w-full bg-surface-container-low border rounded-xl p-3 text-xs font-bold"
                />
              </div>

              {message && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-extrabold text-sm shadow-md"
              >
                Confirm Payout Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
