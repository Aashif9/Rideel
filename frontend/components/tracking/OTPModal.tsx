'use client';

import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  expectedOtp?: string;
  onVerify: (otp: string) => Promise<{ success: boolean; message: string }>;
  isTraveler?: boolean;
}

export default function OTPModal({
  isOpen,
  onClose,
  title,
  subtitle,
  expectedOtp,
  onVerify,
  isTraveler = false
}: OTPModalProps) {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    setError('');

    // Auto advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification OTP.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await onVerify(code);
      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center text-primary mx-auto mb-3">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-primary">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        {/* Sender View - Display expected OTP code clearly */}
        {!isTraveler && expectedOtp && (
          <div className="bg-surface-container p-4 rounded-2xl text-center mb-6 border border-primary-fixed">
            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Share this OTP with Traveler</div>
            <div className="text-3xl font-black text-primary tracking-widest my-2 font-mono">{expectedOtp}</div>
            <p className="text-[11px] text-slate-500">Do not share with anyone else until handoff is verified.</p>
          </div>
        )}

        {/* Traveler View - Enter OTP input fields */}
        {isTraveler && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 text-center text-xl font-bold text-primary bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:bg-white focus:outline-none transition"
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enter the 6-digit OTP code sent to the recipient's phone</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-extrabold text-sm transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Verifying OTP...' : 'Verify & Confirm Handoff'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
