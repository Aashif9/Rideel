'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { DEMO_PRESETS, MOCK_USERS } from '@/lib/constants';
import { User, UserMode } from '@/types';
import {
  Phone, KeyRound, ShieldCheck, User as UserIcon, Building2, Truck,
  Package, LayoutDashboard, CheckCircle2, ArrowRight, Sparkles, RefreshCw,
  AlertCircle, Lock, Smartphone, ChevronRight
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [selectedRole, setSelectedRole] = useState<'sender' | 'traveler' | 'business' | 'admin'>('sender');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    apiServices.getCurrentUser().then(setCurrentUser);
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 && !selectedPresetId) {
      setError('Please enter a valid 10-digit mobile number or select a member preset.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(30);
    }, 600);
  };

  const handleSelectPreset = (preset: typeof DEMO_PRESETS[0]) => {
    const mock = MOCK_USERS.find(u => u.id === preset.id);
    if (mock) {
      setPhone(mock.phone);
      setSelectedPresetId(preset.id);
      setSelectedRole(preset.role as any);
      setError(null);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError(null);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (selectedPresetId) {
        const user = await apiServices.switchPresetUser(selectedPresetId);
        result = { success: true, user };
      } else {
        result = await apiServices.loginWithOTP(phone, code);
      }

      setIsLoading(false);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setStep('success');

        // Determine destination based on role
        setTimeout(() => {
          if (selectedRole === 'admin' || result.user?.role.includes('admin')) {
            router.push('/admin');
          } else if (selectedRole === 'business' || result.user?.role.includes('business')) {
            router.push('/business');
          } else if (selectedRole === 'traveler') {
            router.push('/trips');
          } else {
            router.push('/');
          }
        }, 1500);
      } else {
        setError(result.message || 'Verification failed. Use 123456 as the demo verification code.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const memberTabs = [
    { id: 'sender', label: 'Parcel Sender', icon: Package, desc: 'Send parcels securely with travelers', color: 'bg-primary text-white border-primary' },
    { id: 'traveler', label: 'Traveler & Courier', icon: Truck, desc: 'Earn money delivering on your trip', color: 'bg-emerald-600 text-white border-emerald-600' },
    { id: 'business', label: 'Business B2B', icon: Building2, desc: 'Bulk commercial shipping dashboard', color: 'bg-indigo-600 text-white border-indigo-600' },
    { id: 'admin', label: 'Platform Admin', icon: LayoutDashboard, desc: 'KYC reviews, disputes & control', color: 'bg-amber-600 text-white border-amber-600' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Top Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-lg group-hover:scale-105 transition">
              R
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-primary block leading-none">RIDEEL</span>
              <span className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase block">Peer-to-Peer Express Logistics</span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-6 tracking-tight">
            {step === 'phone' && 'Welcome Back to Rideel'}
            {step === 'otp' && 'Verify Mobile Number'}
            {step === 'success' && 'Login Successful!'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 'phone' && 'Enter your phone number or select a member role to receive your 6-digit code.'}
            {step === 'otp' && `We sent a 6-digit verification code to ${phone || 'your phone number'}.`}
            {step === 'success' && 'Redirecting you to your workspace dashboard...'}
          </p>
        </div>

        {/* Card Container */}
        <div className="rideel-card p-6 md:p-8 shadow-xl border border-surface-container-high relative overflow-hidden bg-white/90 backdrop-blur-md">
          {/* STEP 1: PHONE NUMBER & ROLE PRESETS */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in fade-in">
              {/* Member Role Tabs */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">
                  Select Member Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {memberTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = selectedRole === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(tab.id as any);
                          // Auto match preset if available
                          const preset = DEMO_PRESETS.find(p => p.role === tab.id);
                          if (preset) handleSelectPreset(preset);
                        }}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? `${tab.color} shadow-sm ring-2 ring-offset-1 ring-primary/20`
                            : 'bg-surface-container-lowest text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className="w-5 h-5 mb-1" />
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{tab.label}</div>
                          <div className={`text-[10px] line-clamp-1 ${isSelected ? 'opacity-90' : 'text-slate-500'}`}>
                            {tab.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Member Preset Selector */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>1-Click Demo Member Presets</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left p-2 rounded-lg text-xs font-semibold transition border flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100/50'
                        }`}
                      >
                        <span className="truncate">{preset.label.split('(')[0]}</span>
                        <span className="text-[10px] opacity-75 uppercase ml-1 font-mono font-bold">
                          {preset.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Input Field */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 text-slate-500 font-bold text-sm border-r border-slate-200 pr-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setSelectedPresetId(null);
                    }}
                    placeholder="98765 43210"
                    maxLength={13}
                    className="w-full pl-24 pr-4 py-3.5 text-base font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-xs"
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
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:bg-primary-dark transition flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Get 6-Digit Code</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-surface-container p-3 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800">Phone: +91 {phone || '9876543210'}</span>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-primary font-bold hover:underline"
                >
                  Change
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex items-center justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-13 text-center text-xl font-extrabold text-primary border-2 border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Demo Helper & Auto-Fill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-emerald-800 mb-2">
                  💡 Demo Mode Default OTP Code: <span className="font-mono font-extrabold text-emerald-950 tracking-widest text-sm bg-emerald-200 px-2 py-0.5 rounded">123456</span>
                </p>
                <button
                  type="button"
                  onClick={handleFillDemoOtp}
                  className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
                >
                  Click to Auto-Fill 123456
                </button>
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
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-50"
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

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                <span>Didn't receive code?</span>
                {timer > 0 ? (
                  <span className="text-slate-400">Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimer(30)}
                    className="text-primary font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS REDIRECT */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Logged in as {currentUser?.full_name || 'Member'}!
                </h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Role: <span className="text-primary font-bold">{selectedRole.toUpperCase()}</span>
                </p>
              </div>
              <div className="pt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Navigating to your dashboard...</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>256-Bit Encrypted Secure OTP Authentication</span>
        </div>
      </div>
    </div>
  );
}
