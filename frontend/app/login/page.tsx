'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { User, UserRole } from '@/types';
import {
  Truck, Globe, ArrowRight, ShieldCheck, CheckCircle2,
  User as UserIcon, Mail, Building, Package, Car, Camera,
  RefreshCw, AlertCircle, ArrowLeft, ChevronRight, Lock
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') || 'splash';

  // Screen Flow: 'splash' | 'onboarding' | 'login' | 'otp' | 'profile' | 'success'
  const [screen, setScreen] = useState<string>(initialMode);
  
  // Login Form States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Profile Setup States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['sender', 'traveler']);

  // Onboarding Carousel State (Image 3)
  const [onboardingSlide, setOnboardingSlide] = useState(0);

  const onboardingSlides = [
    {
      title: "Send it today.",
      description: "Send parcels between cities using travelers already heading your way.",
    },
    {
      title: "Earn while traveling.",
      description: "Monetize unused vehicle luggage space on your intercity trips.",
    },
    {
      title: "100% Escrow Protection.",
      description: "Payments are safely locked until receiver verifies delivery OTP.",
    }
  ];

  // Automatic transition from Splash screen after loading animation (2.2s)
  useEffect(() => {
    if (screen === 'splash') {
      const splashTimer = setTimeout(() => {
        setScreen('onboarding');
      }, 2200);
      return () => clearTimeout(splashTimer);
    }
  }, [screen]);

  // Automatic slide rotation on onboarding screen every 3.5s
  useEffect(() => {
    if (screen === 'onboarding') {
      const slideInterval = setInterval(() => {
        setOnboardingSlide((prev) => (prev + 1) % onboardingSlides.length);
      }, 3500);
      return () => clearTimeout(slideInterval);
    }
  }, [screen, onboardingSlides.length]);

  // 60-second Resend OTP Cooldown Timer
  useEffect(() => {
    let interval: any = null;
    if (screen === 'otp' && resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [screen, resendTimer]);

  const startResendTimer = () => {
    setResendTimer(60);
    setCanResend(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;
    setIsLoading(true);

    try {
      const res = await apiServices.sendOTP(formattedPhone);
      setIsLoading(false);
      if (res.success) {
        setScreen('otp');
        startResendTimer();
      } else {
        setError(res.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error sending OTP. Please check your connection.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;

    setIsLoading(true);
    try {
      const res = await apiServices.resendOTP(formattedPhone);
      setIsLoading(false);
      if (res.success) {
        startResendTimer();
        setError('A new OTP has been dispatched to your phone number via MSG91.');
      } else {
        setError(res.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error requesting OTP resend.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`rideel-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`rideel-otp-${index - 1}`);
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

    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;

    setIsLoading(true);
    try {
      const result = await apiServices.loginWithOTP(formattedPhone, code);
      setIsLoading(false);
      if (result.success) {
        if (result.isNewUser) {
          setScreen('profile');
        } else {
          setScreen('success');
          setTimeout(() => {
            router.push('/');
          }, 800);
        }
      } else {
        setError(result.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred during verification.');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setIsLoading(true);
    try {
      await apiServices.updateUserProfile({
        full_name: fullName,
        email: email,
        city: city,
        role: selectedRoles
      });
      setIsLoading(false);
      setScreen('success');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError('Failed to save profile to PostgreSQL database.');
    }
  };

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col items-center justify-center p-4 font-sans select-none">
      
      {/* MOBILE DEVICE CONTAINER */}
      <div className="w-full max-w-[400px] min-h-[680px] bg-white rounded-[36px] shadow-2xl overflow-hidden relative border border-slate-200/60 flex flex-col justify-between transition-all duration-300">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: SPLASH SCREEN (IMAGE 2) */}
        {/* ========================================================================= */}
        {screen === 'splash' && (
          <div className="w-full h-full min-h-[680px] bg-[#002b5c] flex flex-col items-center justify-between p-8 text-white text-center animate-in fade-in duration-300">
            <div className="w-full"></div>
            
            {/* Center Brand Icon */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#002b5c] animate-bounce duration-1000">
                <Truck className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-widest text-white uppercase">RIDEEL</h1>
                <p className="text-xs text-blue-200/80 font-medium mt-1">Your route. Their parcel. Same day.</p>
              </div>
            </div>

            {/* Bottom Automatic Loader */}
            <div className="w-full flex flex-col items-center gap-3 pb-6">
              <div className="w-8 h-8 border-3 border-blue-400/30 border-t-white rounded-full animate-spin"></div>
              
              <div className="w-full max-w-[200px] h-1.5 bg-blue-950/60 rounded-full overflow-hidden border border-blue-400/20">
                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-300 rounded-full animate-pulse transition-all duration-2000 w-full" style={{ animationDuration: '2.2s' }}></div>
              </div>

              <span className="text-[10px] font-extrabold tracking-widest text-blue-200/70 uppercase">
                INITIALIZING SECURE NETWORK...
              </span>

              <button
                onClick={() => setScreen('onboarding')}
                className="text-[11px] font-bold text-blue-200/90 underline hover:text-white transition mt-1"
              >
                Skip wait →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ONBOARDING SLIDER (IMAGE 3) */}
        {/* ========================================================================= */}
        {screen === 'onboarding' && (
          <div className="w-full h-full min-h-[680px] bg-[#f8fafc] flex flex-col justify-between p-6 animate-in fade-in duration-300">
            {/* Top Bar with Skip */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setScreen('login')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition"
              >
                Skip
              </button>
            </div>

            {/* Center Graphic Card */}
            <div className="my-auto space-y-6">
              <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-center relative overflow-hidden min-h-[220px]">
                {/* 3D Intercity Parcel Route Graphic SVG */}
                <svg viewBox="0 0 320 180" className="w-full h-auto">
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#002b5c" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  
                  {/* Subtle Map Grid */}
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
                  </pattern>
                  <rect width="320" height="180" fill="url(#grid)" opacity="0.6" />

                  {/* Intercity Arc Path */}
                  <path d="M 60,130 Q 160,20 260,130" fill="none" stroke="url(#arcGrad)" strokeWidth="4" strokeLinecap="round" filter="url(#shadow)" />
                  
                  {/* Origin Pin */}
                  <g transform="translate(60, 130)">
                    <path d="M 0,0 C -12,-15 -12,-30 0,-30 C 12,-30 12,-15 0,0 Z" fill="#002b5c" />
                    <circle cx="0" cy="-20" r="4" fill="white" />
                  </g>

                  {/* Destination Pin */}
                  <g transform="translate(260, 130)">
                    <path d="M 0,0 C -12,-15 -12,-30 0,-30 C 12,-30 12,-15 0,0 Z" fill="#002b5c" />
                    <circle cx="0" cy="-20" r="4" fill="white" />
                  </g>

                  {/* Moving Parcel Box on Arc */}
                  <g transform="translate(160, 68)">
                    <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#002b5c" />
                    <path d="M -12,-4 L 12,-4 M -4,-12 L -4,12" stroke="#38bdf8" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              {/* Text Info */}
              <div className="text-center space-y-2 px-2">
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
                  {onboardingSlides[onboardingSlide].title}
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                  {onboardingSlides[onboardingSlide].description}
                </p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-6 pb-2">
              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-1.5">
                {onboardingSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOnboardingSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      onboardingSlide === idx ? 'w-6 bg-[#002b5c]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setScreen('login')}
                className="w-full bg-[#002b5c] hover:bg-[#001f44] text-white py-4 rounded-2xl font-bold text-sm shadow-md transition"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: WELCOME & MOBILE ENTRY (IMAGE 1) */}
        {/* ========================================================================= */}
        {screen === 'login' && (
          <div className="w-full h-full min-h-[680px] bg-white flex flex-col justify-between p-6 animate-in fade-in duration-300 relative">
            
            {/* Top Background Pattern Card Header */}
            <div className="space-y-6">
              <div className="w-full bg-gradient-to-b from-blue-50/80 to-blue-50/20 rounded-2xl p-6 relative overflow-hidden border border-blue-100/40">
                {/* Dotted pattern overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002b5c 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                
                {/* Brand Logo Badge */}
                <div className="inline-flex items-center gap-2 bg-[#002b5c] text-white px-3.5 py-2 rounded-xl shadow-sm relative z-10">
                  <Truck className="w-5 h-5" />
                  <span className="font-extrabold text-sm tracking-wider uppercase">RIDEEL</span>
                </div>
              </div>

              {/* Title & Headline */}
              <div className="space-y-1.5 px-1">
                <h1 className="text-2xl font-black text-[#002b5c] tracking-tight">Welcome to Rideel</h1>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Enter your mobile number to securely log in or create a new account.
                </p>
              </div>

              {/* Mobile Input Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    MOBILE NUMBER
                  </label>
                  <div className="flex border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 focus-within:border-[#002b5c] focus-within:ring-1 focus-within:ring-[#002b5c] transition">
                    <div className="flex items-center gap-1.5 px-3.5 bg-slate-100/80 border-r border-slate-200 text-slate-700 font-bold text-xs shrink-0">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="w-full px-4 py-3.5 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Bottom Submit Action & Terms */}
            <div className="space-y-4 pt-6 pb-2">
              <button
                type="button"
                onClick={handlePhoneSubmit}
                disabled={isLoading}
                className="w-full bg-[#002b5c] hover:bg-[#001f44] text-white py-4 rounded-2xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500 font-medium px-4">
                By continuing, you agree to Rideel's{' '}
                <a href="#" className="font-bold text-slate-800 underline">Terms</a> &{' '}
                <a href="#" className="font-bold text-slate-800 underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: OTP VERIFICATION CODE */}
        {/* ========================================================================= */}
        {screen === 'otp' && (
          <div className="w-full h-full min-h-[680px] bg-white flex flex-col justify-between p-6 animate-in fade-in duration-300">
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => setScreen('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Mobile Input
              </button>

              <div>
                <span className="text-xs font-bold text-[#002b5c] bg-blue-50 px-3 py-1 rounded-full inline-block mb-2">
                  +91 {phone}
                </span>
                <h1 className="text-2xl font-black text-[#0f172a]">Verify OTP Code</h1>
                <p className="text-xs text-slate-500 mt-1">We sent a 6-digit verification code to your number.</p>
              </div>

              {/* 6 Digit Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 my-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`rideel-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-13 text-center text-xl font-black text-[#002b5c] border-2 border-slate-200 rounded-xl focus:border-[#002b5c] focus:outline-none bg-slate-50/50"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 font-medium text-center">
                  Enter the 6-digit verification code
                </p>
              </div>

              {error && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-3 pb-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-[#002b5c] hover:bg-[#001f44] text-white py-4 rounded-2xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 text-center py-1 disabled:opacity-60"
              >
                {canResend ? (
                  <span>Didn't receive code? <span className="text-[#002b5c] underline font-black">Resend OTP</span></span>
                ) : (
                  <span>Resend OTP available in <strong className="text-[#002b5c]">{resendTimer}s</strong></span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: PROFILE SETUP (IMAGE 4) */}
        {/* ========================================================================= */}
        {screen === 'profile' && (
          <div className="w-full h-full min-h-[680px] bg-[#f8fafc] flex flex-col justify-between p-6 animate-in fade-in duration-300">
            <div className="space-y-5">
              {/* Header */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Let's set up your profile</h1>
                <p className="text-xs text-slate-500 font-medium">Complete your details to start using Rideel.</p>
              </div>

              {/* Profile Photo Upload Avatar */}
              <div className="flex justify-center py-1">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center justify-center text-blue-600 relative cursor-pointer hover:bg-blue-100/50 transition">
                  <Camera className="w-6 h-6 text-slate-500" />
                  <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#002b5c] text-white flex items-center justify-center text-xs font-bold shadow-md">+</span>
                </div>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleProfileSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rohan@example.com"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    CITY
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                    />
                  </div>
                </div>

                {/* Role Selector Section */}
                <div className="pt-2 space-y-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0f172a]">How will you use Rideel?</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Select all that apply.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRole('sender')}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                        selectedRoles.includes('sender')
                          ? 'border-[#002b5c] bg-white ring-2 ring-[#002b5c]/10 text-[#002b5c]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Package className="w-6 h-6" />
                      <span className="text-xs font-extrabold">Send Parcels</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleRole('traveler')}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                        selectedRoles.includes('traveler')
                          ? 'border-[#002b5c] bg-white ring-2 ring-[#002b5c]/10 text-[#002b5c]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Car className="w-6 h-6" />
                      <span className="text-xs font-extrabold">Travel & Earn</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-4 pb-2">
              <button
                type="button"
                onClick={handleProfileSubmit}
                disabled={isLoading}
                className="w-full bg-[#002b5c] hover:bg-[#001f44] text-white py-4 rounded-2xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUCCESS SCREEN */}
        {/* ========================================================================= */}
        {screen === 'success' && (
          <div className="w-full h-full min-h-[680px] bg-white flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-[#0f172a]">Setup Complete!</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Welcome to Rideel, <strong>{fullName}</strong>. Redirecting to dashboard...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500">Loading authentication screen...</div>}>
      <LoginContent />
    </Suspense>
  );
}
