'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { User } from '@/types';
import {
  Smartphone, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw,
  AlertCircle, Lock, ArrowLeft
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    apiServices.getCurrentUser().then(setCurrentUser);
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`clean-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`clean-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiServices.loginWithOTP(phone, code);
      setIsLoading(false);

      if (result.success && result.user) {
        setCurrentUser(result.user);
        setStep('success');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setError(result.message || 'Invalid code. Use 123456 as demo OTP.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
              R
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-primary block leading-none">RIDEEL</span>
              <span className="text-[11px] text-slate-500 font-bold tracking-wider uppercase block">Peer-to-Peer Logistics</span>
            </div>
          </Link>
        </div>

        {/* Clean Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 backdrop-blur-sm">
          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Login or Sign Up</h1>
                <p className="text-sm text-slate-500 mt-1">Enter your phone number to receive a verification code</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Mobile Phone Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 flex items-center gap-2 text-slate-700 font-bold text-sm border-r border-slate-200 pr-3">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    autoFocus
                    className="w-full pl-24 pr-4 py-4 text-lg font-bold text-slate-900 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50 shadow-xs tracking-wide"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-extrabold text-base shadow-lg shadow-primary/20 hover:bg-primary-dark transition flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Get OTP Code</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Change Number
                </button>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  +91 {phone}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enter OTP Code</h1>
                <p className="text-sm text-slate-500 mt-1">We sent a 6-digit code to +91 {phone}</p>
              </div>

              {/* 6 Digit Input */}
              <div>
                <div className="flex items-center justify-between gap-2 my-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`clean-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-12 h-14 text-center text-2xl font-extrabold text-primary border-2 border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none bg-slate-50/50 shadow-xs"
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-slate-400 font-medium">
                  Demo Code: <span className="font-bold text-slate-600 font-mono">123456</span>
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-extrabold text-base shadow-lg shadow-primary/20 hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Login Successful!</h3>
                <p className="text-xs text-slate-500 mt-1">Welcome back to Rideel</p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Redirecting...</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Secure Encrypted OTP Authentication</span>
        </div>
      </div>
    </div>
  );
}
