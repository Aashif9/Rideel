'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Bell, MapPin, Navigation, Package, Bike, Car, Truck,
  ChevronRight, Plus, Minus, Info, ArrowRight, ShieldCheck
} from 'lucide-react';

function SendParcelRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pickupLoc, setPickupLoc] = useState(searchParams.get('origin') || 'Anna Nagar, Chennai');
  const [deliveryLoc, setDeliveryLoc] = useState(searchParams.get('dest') || 'T. Nagar, Chennai');
  const [parcelType, setParcelType] = useState('1 kg • Document');
  const [selectedOption, setSelectedOption] = useState<'express' | 'standard' | 'large'>('express');

  const deliveryOptions = [
    {
      id: 'express',
      title: 'Express ⚡',
      priceRange: '₹80 – ₹120',
      description: 'Fastest delivery • Same day',
      eta: 'ETA 1-2 hours',
      icon: Bike,
    },
    {
      id: 'standard',
      title: 'Standard',
      priceRange: '₹60 – ₹90',
      description: 'Cost effective • Reliable',
      eta: 'ETA 3-5 hours',
      icon: Car,
    },
    {
      id: 'large',
      title: 'Large Parcel',
      priceRange: '₹150 – ₹300',
      description: 'For heavier items',
      eta: 'ETA 4-8 hours',
      icon: Truck,
    },
  ];

  const activeOptionObj = deliveryOptions.find(o => o.id === selectedOption) || deliveryOptions[0];

  const handleProceed = () => {
    const query = new URLSearchParams({
      origin: pickupLoc,
      destination: deliveryLoc,
      option: selectedOption,
      fare: activeOptionObj.priceRange
    }).toString();
    router.push(`/send/parcel-details?${query}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8fafc] pb-28 font-sans text-slate-900 animate-in fade-in select-none">
      
      {/* 1. TOP NAV HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#002b5c] text-white font-extrabold flex items-center justify-center text-base">
              R
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-wide text-[#002b5c] leading-tight">RIDEEL</div>
              <div className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">
                PEOPLE • PARCELS • POSSIBILITIES
              </div>
            </div>
          </div>
        </div>

        <div className="relative cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <Bell className="w-4 h-4" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center border border-white">
            3
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* 2. TITLE */}
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Send a Parcel</h1>
          <p className="text-xs text-slate-500 font-medium">Find trusted travelers & couriers</p>
        </div>

        {/* 3. INTERACTIVE MAP BOX WITH ROUTE LINE */}
        <div className="relative w-full h-56 bg-slate-200 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
          {/* Tile Background Simulation */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=13.0827,80.2707&zoom=12&size=600x300&sensor=false&key=')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* SVG Overlay Route Line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 100 60 Q 150 110 210 150"
                fill="none"
                stroke="#0f172a"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* Pickup Marker Box */}
            <div className="absolute left-16 top-6 bg-white rounded-xl shadow-md px-3 py-1.5 border border-slate-200 flex items-center gap-1.5 animate-bounce">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <div className="text-[10px] leading-tight">
                <span className="text-slate-400 font-bold block text-[8px]">Pickup</span>
                <span className="font-extrabold text-slate-900">Anna Nagar</span>
              </div>
            </div>

            {/* Delivery Marker Box */}
            <div className="absolute right-12 bottom-8 bg-white rounded-xl shadow-md px-3 py-1.5 border border-slate-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <div className="text-[10px] leading-tight">
                <span className="text-slate-400 font-bold block text-[8px]">Delivery</span>
                <span className="font-extrabold text-slate-900">T. Nagar</span>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              <button className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur text-slate-700 shadow-sm flex items-center justify-center font-bold">
                <Navigation className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur text-slate-700 shadow-sm flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur text-slate-700 shadow-sm flex items-center justify-center font-bold">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. ADDRESS & PARCEL SPECS CARD */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          {/* Pickup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Pickup Location</span>
                <input
                  type="text"
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  className="font-extrabold text-xs text-slate-900 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>
            <Navigation className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-700" />
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Delivery */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-rose-500 bg-white flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Delivery Location</span>
                <input
                  type="text"
                  value={deliveryLoc}
                  onChange={(e) => setDeliveryLoc(e.target.value)}
                  className="font-extrabold text-xs text-slate-900 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>
            <Navigation className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-700" />
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Parcel Specs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Parcel Details</span>
                <input
                  type="text"
                  value={parcelType}
                  onChange={(e) => setParcelType(e.target.value)}
                  className="font-extrabold text-xs text-slate-900 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
        </div>

        {/* 5. CHOOSE A DELIVERY OPTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0f172a]">Choose a delivery option</h2>
            <span className="text-xs font-bold text-[#002b5c] cursor-pointer hover:underline">See all &gt;</span>
          </div>

          <div className="space-y-2">
            {deliveryOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id as any)}
                  className={`bg-white rounded-2xl p-3.5 shadow-xs border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#002b5c] ring-2 ring-[#002b5c]/10 bg-blue-50/20'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#002b5c] text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{opt.title}</span>
                        <span className="text-xs font-black text-slate-900">{opt.priceRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span>{opt.description}</span>
                        <span>•</span>
                        <span>{opt.eta}</span>
                      </div>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#002b5c] bg-white' : 'border-slate-300'}`}>
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#002b5c]"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3.5 flex items-center justify-between z-50 shadow-xl">
        <div>
          <div className="text-base font-black text-[#0f172a] leading-tight">
            {activeOptionObj.priceRange}
          </div>
          <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
            <span>Estimated fare</span>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="bg-[#002b5c] hover:bg-[#001f44] text-white px-7 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition flex items-center gap-2"
        >
          <span>Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default function SendParcelRoutePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-500">Loading route settings...</div>}>
      <SendParcelRouteContent />
    </Suspense>
  );
}
