'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiServices } from '@/services/apiServices';
import { Trip, User } from '@/types';
import { CITIES } from '@/lib/constants';
import { Navigation, Plus, MapPin, Calendar, Clock, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

export default function TripsDashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Post Trip Form State
  const [origin, setOrigin] = useState('Vijayawada');
  const [destination, setDestination] = useState('Hyderabad');
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

  const handlePostTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (origin === destination) {
      alert('Origin and Destination cities must be different intercity locations.');
      return;
    }

    setLoading(true);
    try {
      const created = await apiServices.postTrip({
        origin,
        destination,
        origin_coordinates: [16.5, 80.6],
        destination_coordinates: [17.3, 78.4],
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
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Traveler Trips & Earnings</h1>
          <p className="text-xs text-slate-500">Post your intercity travel routes and earn money delivering parcels.</p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 rounded-xl text-xs font-extrabold shadow-lg transition flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
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

      {/* Post Trip Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-surface-container-high max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-primary mb-1">Post Intercity Travel Route</h3>
            <p className="text-xs text-slate-500 mb-6">Specify your travel route and available luggage space.</p>

            <form onSubmit={handlePostTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Origin City</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Destination City</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Departure Time</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Est Arrival</label>
                  <input
                    type="time"
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Capacity (kg)</label>
                  <input
                    type="number"
                    value={capacityKg}
                    onChange={(e) => setCapacityKg(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Max Weight / Item</label>
                  <input
                    type="number"
                    value={maxWeightKg}
                    onChange={(e) => setMaxWeightKg(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Price / kg (₹)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold text-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-md"
                >
                  {loading ? 'Posting...' : 'Publish Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
