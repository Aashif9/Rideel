'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { PROHIBITED_ITEMS, FEE_CONFIG } from '@/lib/constants';
import { Package, Shield, AlertTriangle, ArrowRight, ChevronRight, CheckSquare } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prohibitedAccepted) {
      setError('You must confirm that the parcel contains no restricted or prohibited items.');
      return;
    }

    if (weightKg <= 0 || weightKg > 25) {
      setError('Parcel weight must be between 0.1 kg and 25 kg.');
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      {/* Timeline Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b pb-4">
        <span className="text-slate-500">Route & Handoff</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary font-extrabold flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</span>
          Parcel Details
        </span>
        <ChevronRight className="w-4 h-4" />
        <span>Match Traveler</span>
        <ChevronRight className="w-4 h-4" />
        <span>Payment & Escrow</span>
      </div>

      <div className="rideel-card p-6 md:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded">
            {origin} → {destination} ({travelDate})
          </span>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mt-1">Parcel & Cargo Details</h1>
          <p className="text-xs text-slate-500">Provide accurate weight and dimensions for traveler matching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Parcel Category
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
                  onClick={() => setParcelType(cat.type as ParcelType)}
                  className={`p-3 rounded-xl border text-center transition ${
                    parcelType === cat.type
                      ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Package className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-extrabold">{cat.title}</div>
                  <div className="text-[10px] text-slate-500">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight & Dimensions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="25"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Length (cm)</label>
              <input
                type="number"
                value={lengthCm}
                onChange={(e) => setLengthCm(parseInt(e.target.value) || 0)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Width (cm)</label>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(parseInt(e.target.value) || 0)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Parcel Contents Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Legal documents, laptop, clothing package..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Declared Value & Insurance Opt-in */}
          <div className="p-4 bg-surface-container rounded-2xl border border-surface-container-high space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 block">Declared Value (₹)</label>
                <span className="text-[11px] text-slate-500">Value of items for insurance coverage</span>
              </div>
              <input
                type="number"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 0)}
                className="w-32 bg-white border border-outline-variant rounded-xl p-2 text-right text-sm font-extrabold text-primary"
              />
            </div>

            <div className="border-t border-slate-300 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Include Rideel Parcel Protection Insurance</div>
                  <div className="text-[10px] text-slate-500">Covers damage, loss or delay up to ₹10,000</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={insuranceSelected}
                onChange={(e) => setInsuranceSelected(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Prohibited Items System Confirmation */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
            <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> Prohibited & Restricted Cargo Warning
            </div>
            <ul className="list-disc pl-5 text-[11px] text-amber-800 space-y-1">
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
            className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Finding Travelers...' : 'Find Matching Travelers'}</span>
            <ArrowRight className="w-4 h-4" />
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
