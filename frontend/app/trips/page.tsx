'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { Trip, User } from '@/types';
import { CITIES, CITY_COORDINATES } from '@/lib/constants';
import LocationPickerModal from '@/components/ui/LocationPickerModal';
import { Navigation, Plus, MapPin, Calendar, Clock, Truck, ShieldCheck, ChevronRight, ArrowLeft, Search, Globe, Crosshair } from 'lucide-react';

export default function TripsDashboardPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Location Picker Modal States
  const [activeLocationPicker, setActiveLocationPicker] = useState<'origin' | 'destination' | null>(null);

  // Post Trip Form State
  const [origin, setOrigin] = useState('Vijayawada');
  const [destination, setDestination] = useState('Hyderabad');
  const [originCoords, setOriginCoords] = useState<[number, number]>([16.5062, 80.6480]);
  const [destCoords, setDestCoords] = useState<[number, number]>([17.3850, 78.4867]);
  const [travelDate, setTravelDate] = useState('2026-09-02');
  const [departureTime, setDepartureTime] = useState('07:30');
  const [estimatedArrival, setEstimatedArrival] = useState('12:00');
  const [capacityKg, setCapacityKg] = useState(15);
  const [maxWeightKg, setMaxWeightKg] = useState(8);
  const [pricePerKg, setPricePerKg] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiServices.getCurrentUser().then(setCurrentUser);
    apiServices.getTrips().then(setTrips);
  }, []);

  const handleOriginChange = (val: string) => {
    setOrigin(val);
    if (CITY_COORDINATES[val]) {
      setOriginCoords(CITY_COORDINATES[val]);
    }
  };

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    if (CITY_COORDINATES[val]) {
      setDestCoords(CITY_COORDINATES[val]);
    }
  };

  const handlePostTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      alert('Origin and Destination cities must be different intercity locations.');
      return;
    }

    setLoading(true);
    try {
      const created = await apiServices.postTrip({
        origin,
        destination,
        origin_coordinates: originCoords,
        destination_coordinates: destCoords,
        travel_date: travelDate,
        departure_time: departureTime,
        estimated_arrival: estimatedArrival,
        vehicle_id: 'veh_1',
        capacity_kg: capacityKg,
        max_weight_kg: maxWeightKg,
        pickup_preference: 'meet_traveler',
        delivery_preference: 'meet_traveler',
        price_per_kg: pricePerKg
      });

      setTrips(prev => [created, ...prev]);
      setShowPostModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto p-2 sm:p-4 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 border border-slate-200/80 shrink-0"
            aria-label="Go to Home"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Traveler Trips & Earnings</h1>
            <p className="text-xs text-slate-500 font-medium">Post your intercity travel routes and earn money delivering parcels.</p>
          </div>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-amber-400/20 active:scale-95 transition-all transform flex items-center gap-2 self-start uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 stroke-[3px] text-slate-950" />
          <span>Post a New Trip</span>
        </button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trips.map((trip) => (
          <div key={trip.id} className="rideel-card p-5 space-y-4 hover:border-primary transition">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">TRIP ID: {trip.id}</span>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {trip.origin} → {trip.destination}
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                {trip.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-surface-container p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Travel Date</span>
                <span className="font-bold text-slate-900">{trip.travel_date}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Departure</span>
                <span className="font-bold text-slate-900">{trip.departure_time}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Capacity</span>
                <span className="font-extrabold text-emerald-700">{trip.available_capacity_kg} kg left</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Rate: <strong className="text-primary font-extrabold text-sm">₹{trip.price_per_kg}/kg</strong>
              </div>
              <Link
                href={`/trips/${trip.id}`}
                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-container transition shadow-xs flex items-center gap-1"
              >
                <span>Trip Control View</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Post Trip Modal with Interactive Google Maps Location & Route Selector */}
      {showPostModal && !activeLocationPicker && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in select-none">
          <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Mobile Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden -mt-1 mb-1"></div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#002b5c] tracking-tight">Post Intercity Travel Route</h3>
                <p className="text-xs text-slate-500 font-medium">Select places directly from Google Maps or search places.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Interactive Google Maps Embedded Route Preview */}
            <div 
              onClick={() => setActiveLocationPicker('origin')}
              className="relative w-full h-44 sm:h-48 bg-slate-100 rounded-2xl overflow-hidden shadow-xs border border-slate-200 cursor-pointer group hover:border-[#002b5c]/40 transition"
            >
              <iframe
                title="Interactive Route Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(origin + ' to ' + destination)}&output=embed`}
                className="w-full h-full pointer-events-none select-none"
              />
              <div className="absolute top-2.5 right-2.5 bg-[#002b5c]/95 text-white px-3 py-1 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-md backdrop-blur">
                <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Tap Map to Change Route</span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-extrabold text-slate-900 shadow-sm">
                <span className="text-emerald-700 flex items-center gap-1 truncate max-w-[130px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span> {origin}
                </span>
                <span className="text-slate-400 font-normal">➔</span>
                <span className="text-rose-700 flex items-center gap-1 truncate max-w-[130px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span> {destination}
                </span>
              </div>
            </div>

            <form onSubmit={handlePostTrip} className="space-y-4">
              {/* Origin & Destination Selectors with Direct Google Maps Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      ORIGIN (FROM)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveLocationPicker('origin')}
                      className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" /> Map Picker
                    </button>
                  </div>
                  <select
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    {!CITIES.includes(origin) && <option value={origin}>{origin}</option>}
                  </select>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      DESTINATION (TO)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveLocationPicker('destination')}
                      className="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full hover:bg-rose-100 transition flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" /> Map Picker
                    </button>
                  </div>
                  <select
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    {!CITIES.includes(destination) && <option value={destination}>{destination}</option>}
                  </select>
                </div>
              </div>

              {/* Date & Time Settings */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    TRAVEL DATE
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      DEPARTURE TIME
                    </label>
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      EST ARRIVAL TIME
                    </label>
                    <input
                      type="time"
                      value={estimatedArrival}
                      onChange={(e) => setEstimatedArrival(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#002b5c]"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity Stepper & Price Controls */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      AVAILABLE CAPACITY
                    </label>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setCapacityKg(Math.max(1, capacityKg - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-black text-base hover:bg-slate-200 flex items-center justify-center active:scale-95 transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-slate-900">{capacityKg} kg</span>
                      <button
                        type="button"
                        onClick={() => setCapacityKg(capacityKg + 1)}
                        className="w-8 h-8 rounded-lg bg-[#002b5c] text-white font-black text-base hover:bg-[#001f44] flex items-center justify-center active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      MAX SINGLE ITEM
                    </label>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setMaxWeightKg(Math.max(1, maxWeightKg - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-black text-base hover:bg-slate-200 flex items-center justify-center active:scale-95 transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-slate-900">{maxWeightKg} kg</span>
                      <button
                        type="button"
                        onClick={() => setMaxWeightKg(maxWeightKg + 1)}
                        className="w-8 h-8 rounded-lg bg-[#002b5c] text-white font-black text-base hover:bg-[#001f44] flex items-center justify-center active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    EXPECTED RATE PER KG (₹)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-black text-[#002b5c] text-xs">₹</span>
                    <input
                      type="number"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-8 pr-12 text-xs font-black text-[#002b5c] focus:outline-none focus:border-[#002b5c]"
                    />
                    <span className="absolute right-3 font-bold text-slate-400 text-[10px]">/ kg</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#002b5c] hover:bg-[#001f44] text-white py-3.5 rounded-2xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Publishing Route...' : 'Publish Travel Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Google Maps Location Picker Modal */}
      {activeLocationPicker && (
        <LocationPickerModal
          isOpen={!!activeLocationPicker}
          onClose={() => setActiveLocationPicker(null)}
          title={activeLocationPicker === 'origin' ? 'Pick Origin (From) on Google Maps' : 'Pick Destination (To) on Google Maps'}
          initialValue={activeLocationPicker === 'origin' ? origin : destination}
          onSelectLocation={(loc) => {
            const cityName = loc.city || loc.name;
            if (activeLocationPicker === 'origin') {
              setOrigin(cityName);
              if (loc.lat && loc.lng) setOriginCoords([loc.lat, loc.lng]);
            } else {
              setDestination(cityName);
              if (loc.lat && loc.lng) setDestCoords([loc.lat, loc.lng]);
            }
            setActiveLocationPicker(null);
          }}
        />
      )}
    </div>
  );
}
