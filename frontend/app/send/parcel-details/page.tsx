'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { PROHIBITED_ITEMS, FEE_CONFIG } from '@/lib/constants';
import { Package, Shield, AlertTriangle, ArrowRight, ArrowLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { ParcelType } from '@/types';

function ParcelDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get('origin') || 'Vijayawada';
  const destination = searchParams.get('destination') || 'Hyderabad';
  const travelDate = searchParams.get('travelDate') || '2026-09-02';
  const pickupPref = (searchParams.get('pickupPref') || 'meet_traveler') as any;
  const deliveryPref = (searchParams.get('deliveryPref') || 'meet_traveler') as any;

  const [parcelType, setParcelType] = useState<ParcelType>('small');
  const [weightKg, setWeightKg] = useState(3.5);
  const [lengthCm, setLengthCm] = useState(30);
  const [widthCm, setWidthCm] = useState(20);
  const [heightCm, setHeightCm] = useState(10);
  const [description, setDescription] = useState('Urgent Tax Documents & Laptops Spare Chargers');
  const [declaredValue, setDeclaredValue] = useState(4500);
  const [insuranceSelected, setInsuranceSelected] = useState(true);
  const [prohibitedAccepted, setProhibitedAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWeightChange = (newWeight: number) => {
    const validWeight = Math.max(0.1, Math.min(50, Math.round(newWeight * 10) / 10));
    setWeightKg(validWeight);

    // Auto-update category based on weight
    if (validWeight <= 1.0) {
      setParcelType('document');
    } else if (validWeight <= 5.0) {
      setParcelType('small');
    } else if (validWeight <= 15.0) {
      setParcelType('medium');
    } else {
      setParcelType('large' as any);
    }
  };

  const handleCategorySelect = (catType: string) => {
    setParcelType(catType as ParcelType);
    if (catType === 'document') {
      setWeightKg(0.5);
      setLengthCm(25);
      setWidthCm(18);
      setHeightCm(2);
    } else if (catType === 'small') {
      setWeightKg(2.5);
      setLengthCm(30);
      setWidthCm(20);
      setHeightCm(10);
    } else if (catType === 'medium') {
      setWeightKg(8.0);
      setLengthCm(45);
      setWidthCm(35);
      setHeightCm(25);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prohibitedAccepted) {
      setError('You must confirm that the parcel contains no restricted or prohibited items.');
      return;
    }

    if (weightKg <= 0 || weightKg > 50) {
      setError('Parcel weight must be between 0.1 kg and 50 kg.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await apiServices.createParcel({
        parcel_type: parcelType,
        description,
        weight_kg: weightKg,
        length_cm: lengthCm,
        width_cm: widthCm,
        height_cm: heightCm,
        parcel_photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
        declared_value: declaredValue,
        insurance_selected: insuranceSelected,
        insurance_amount: insuranceSelected ? FEE_CONFIG.INSURANCE_BASIC_FEE : 0,
        origin,
        destination,
        travel_date: travelDate,
        pickup_preference: pickupPref,
        delivery_preference: deliveryPref
      });

      router.push(`/send/travelers?parcelId=${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to register parcel details.');
    } finally {
      setLoading(false);
    }
  };

  const [quote, setQuote] = useState<any>(null);
  const [isCalculatingQuote, setIsCalculatingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  // Real-time Pricing Quote Effect
  React.useEffect(() => {
    let isMounted = true;
    const fetchQuote = async () => {
      if (!origin || !destination) return;
      setIsCalculatingQuote(true);
      setQuoteError('');
      try {
        const res = await apiServices.getPricingQuote({
          pickup: { name: origin },
          dropoff: { name: destination },
          weightKg: Number(weightKg) || 1,
          packageType: parcelType.toUpperCase(),
          deliverySpeed: 'SAME_DAY',
          insuranceSelected,
          declaredValue: Number(declaredValue) || 1000,
        });

        if (!isMounted) return;
        if (res.success && res.quote) {
          setQuote(res.quote);
        } else {
          setQuoteError(res.message || 'Unable to calculate delivery price. Please check your pickup and dropoff locations.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setQuoteError('Unable to calculate delivery price. Please check your pickup and dropoff locations.');
      } finally {
        if (isMounted) setIsCalculatingQuote(false);
      }
    };

    fetchQuote();
    return () => { isMounted = false; };
  }, [origin, destination, weightKg, parcelType, insuranceSelected, declaredValue]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in select-none p-2 sm:p-4">
      {/* Back Button Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 border border-slate-200/80 shrink-0"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#0f172a] tracking-tight">Parcel Details</h1>
          <p className="text-xs text-slate-500 font-medium">Step 2 of 4 • Set parcel size & insurance</p>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-200/80 pb-4">
        <span className="text-slate-500">Route & Handoff</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#002b5c] font-extrabold flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-[#002b5c] text-white flex items-center justify-center text-xs">2</span>
          Parcel Details
        </span>
        <ChevronRight className="w-4 h-4" />
        <span>Match Traveler</span>
        <ChevronRight className="w-4 h-4" />
        <span>Payment & Escrow</span>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 space-y-6 shadow-sm border border-slate-200/80">
        <div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 font-bold px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-1">
            {origin} → {destination} ({travelDate})
          </span>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Parcel & Cargo Details</h2>
          <p className="text-xs text-slate-500 font-medium">Provide accurate weight and dimensions for traveler matching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parcel Category Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              PARCEL CATEGORY
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'document', title: 'Document', desc: 'Under 1 kg' },
                { type: 'small', title: 'Small Pack', desc: '1 – 5 kg' },
                { type: 'medium', title: 'Medium Box', desc: '5 – 15 kg' }
              ].map((cat) => (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => handleCategorySelect(cat.type)}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    parcelType === cat.type
                      ? 'border-[#002b5c] bg-blue-50/50 text-[#002b5c] ring-2 ring-[#002b5c]/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Package className="w-5 h-5 mx-auto text-[#002b5c]" />
                  <div className="text-xs font-black">{cat.title}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* WEIGHT OPERATION CARD (STEPPER & QUICK PRESETS) */}
          <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                  WEIGHT (KG)
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  Use stepper (- / +) or type exact weight
                </span>
              </div>
              
              {/* Stepper Control */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleWeightChange(weightKg - 0.5)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center transition active:scale-95 text-base"
                >
                  -
                </button>

                <input
                  type="number"
                  step="any"
                  min="0.1"
                  max="50"
                  value={weightKg}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setWeightKg(isNaN(val) ? 0 : val);
                  }}
                  className="w-16 text-center text-base font-black text-[#002b5c] bg-transparent focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleWeightChange(weightKg + 0.5)}
                  className="w-8 h-8 rounded-xl bg-[#002b5c] hover:bg-[#001f44] text-white font-extrabold flex items-center justify-center transition active:scale-95 text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Weight Preset Pills */}
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">
                Quick Select Weight Presets:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0.5, 1.0, 2.5, 3.5, 5.0, 10.0, 15.0, 20.0].map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => handleWeightChange(wt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      weightKg === wt
                        ? 'bg-[#002b5c] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {wt} kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DIMENSIONS (LENGTH x WIDTH x HEIGHT) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              DIMENSIONS (CM) & VOLUMETRIC CALCULATOR
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LENGTH (CM)</label>
                <input
                  type="number"
                  step="any"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">WIDTH (CM)</label>
                <input
                  type="number"
                  step="any"
                  value={widthCm}
                  onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">HEIGHT (CM)</label>
                <input
                  type="number"
                  step="any"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              PARCEL CONTENTS DESCRIPTION
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Legal documents, laptop, clothing package..."
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#002b5c]"
            />
          </div>

          {/* Declared Value & Insurance Opt-in */}
          <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase text-slate-800 block">DECLARED VALUE (₹)</label>
                <span className="text-[10px] text-slate-500 font-medium">Value of items for insurance coverage</span>
              </div>
              <input
                type="number"
                step="any"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 0)}
                className="w-32 bg-white border border-slate-200 rounded-xl p-2.5 text-right text-xs font-black text-[#002b5c]"
              />
            </div>

            <div className="border-t border-blue-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Include Rideel Parcel Protection Insurance</div>
                  <div className="text-[10px] text-slate-500 font-medium">Covers damage, loss or delay up to ₹10,000</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={insuranceSelected}
                onChange={(e) => setInsuranceSelected(e.target.checked)}
                className="w-5 h-5 accent-[#002b5c] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* DYNAMIC DELIVERY PRICE BREAKDOWN CARD */}
          <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-[#002b5c] text-white rounded-3xl shadow-xl space-y-4 border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  DELIVERY PRICE BREAKDOWN
                </span>
                <span className="text-xs text-slate-300 font-medium">Authoritative calculation engine</span>
              </div>
              {isCalculatingQuote ? (
                <span className="text-xs font-bold text-amber-300 animate-pulse">Calculating fare...</span>
              ) : quoteError ? (
                <span className="text-[10px] font-bold text-rose-300 max-w-[140px] text-right block">{quoteError}</span>
              ) : (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  {quote?.distanceKm} km route
                </span>
              )}
            </div>

            {quote ? (
              <div className="space-y-2 text-xs font-medium text-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-extrabold text-white">{origin} → {destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Road Distance:</span>
                  <span className="font-bold">{quote.distanceKm} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Base fee:</span>
                  <span>{quote.formatted.baseFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Distance ({quote.distanceKm} km):</span>
                  <span>{quote.formatted.distanceCharge}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Package ({weightKg} kg):</span>
                  <span>{quote.formatted.weightCharge}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Same-Day / Express speed:</span>
                  <span>{quote.formatted.speedCharge}</span>
                </div>
                {insuranceSelected && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Optional Insurance:</span>
                    <span className="text-emerald-400 font-semibold">{quote.formatted.insuranceCharge}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">RIDEEL service fee (10%):</span>
                  <span>{quote.formatted.platformFee}</span>
                </div>

                <div className="border-t border-slate-700/80 pt-3 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      ESTIMATED TOTAL SENDER PRICE
                    </span>
                    <span className="text-xl font-black text-amber-400">{quote.formatted.total}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      TRAVELER PAYOUT
                    </span>
                    <span className="text-lg font-black text-emerald-400">{quote.formatted.travelerPayout}</span>
                  </div>
                </div>
              </div>
            ) : isCalculatingQuote ? (
              <div className="py-6 text-center text-xs text-slate-400 font-bold animate-pulse">
                Calculating road route distance & dynamic fare breakdown...
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-rose-300 font-bold">
                {quoteError || 'Unable to calculate delivery price. Please check your pickup and dropoff locations.'}
              </div>
            )}
          </div>

          {/* Prohibited Items Confirmation */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
            <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> Prohibited & Restricted Cargo Warning
            </div>
            <ul className="list-disc pl-5 text-[11px] text-amber-800 space-y-1 font-medium">
              {PROHIBITED_ITEMS.slice(0, 3).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prohibitedAccepted}
                onChange={(e) => setProhibitedAccepted(e.target.checked)}
                className="w-4 h-4 accent-amber-700 rounded mt-0.5"
              />
              <span className="text-[11px] font-bold text-amber-950">
                I confirm under penalty of platform ban that this parcel contains NO prohibited items.
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform active:scale-98 shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Finding Travelers...' : 'Find Matching Travelers'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ParcelDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500">Loading parcel details...</div>}>
      <ParcelDetailsContent />
    </Suspense>
  );
}
