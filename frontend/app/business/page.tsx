'use client';

import React, { useState, useEffect } from 'react';
import { apiServices } from '@/services/apiServices';
import { BulkShipment, BusinessAccount } from '@/types';
import { Building2, Package, Plus, TrendingUp, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export default function BusinessDashboardPage() {
  const [bulkList, setBulkList] = useState<BulkShipment[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Bulk Shipment Form
  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState('Pune');
  const [shipmentCount, setShipmentCount] = useState(8);
  const [totalWeight, setTotalWeight] = useState(24);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load database state
    const db = (apiServices as any).getDb();
    setBulkList(db.bulkShipments || []);
  }, []);

  const handleCreateBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const created = await apiServices.createBulkShipment({
      shipment_count: shipmentCount,
      origin,
      destination,
      pickup_date: '2026-09-03',
      total_weight_kg: totalWeight,
      total_cost: shipmentCount * 180
    });
    setBulkList(prev => [created, ...prev]);
    setShowBulkModal(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" /> Apex Logistics B2B Corporate Portal
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Business Shipment Portal</h1>
          <p className="text-xs text-slate-500">Manage recurring intercity parcel dispatches & multi-package bulk shipments.</p>
        </div>

        <button
          onClick={() => setShowBulkModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-xs font-extrabold shadow-lg transition flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Create Bulk Shipment</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Corporate Shipments</span>
          <div className="text-2xl font-black text-slate-900">158</div>
          <span className="text-[11px] text-emerald-700 font-bold">+12% this month</span>
        </div>
        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active In-Transit</span>
          <div className="text-2xl font-black text-primary">14</div>
          <span className="text-[11px] text-slate-500 font-medium">9 Travelers paired</span>
        </div>
        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Logistics Spend</span>
          <div className="text-2xl font-black text-slate-900">₹42,850</div>
          <span className="text-[11px] text-emerald-700 font-bold">Saved 38% vs traditional courier</span>
        </div>
        <div className="rideel-card p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Same-Day SLA Success</span>
          <div className="text-2xl font-black text-emerald-700">99.4%</div>
          <span className="text-[11px] text-slate-500 font-medium">Zero lost claims</span>
        </div>
      </div>

      {/* Bulk Shipments Table */}
      <div className="rideel-card p-6 space-y-4">
        <h3 className="text-base font-extrabold text-primary">Bulk & Multi-Parcel Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2">Shipment ID</th>
                <th className="py-2">Route</th>
                <th className="py-2">Parcels</th>
                <th className="py-2">Total Weight</th>
                <th className="py-2">Cost</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {bulkList.map((bulk) => (
                <tr key={bulk.id} className="hover:bg-surface-container-low">
                  <td className="py-3 font-mono font-bold text-primary">{bulk.id}</td>
                  <td className="py-3 font-bold">{bulk.origin} → {bulk.destination}</td>
                  <td className="py-3">{bulk.shipment_count} Packages</td>
                  <td className="py-3">{bulk.total_weight_kg} kg</td>
                  <td className="py-3 font-extrabold text-slate-900">₹{bulk.total_cost}</td>
                  <td className="py-3">
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {bulk.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Bulk Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high">
            <h3 className="text-xl font-extrabold text-primary mb-1">Create Bulk Shipment Order</h3>
            <p className="text-xs text-slate-500 mb-4">Batch parcel dispatches to multiple verified travelers.</p>

            <form onSubmit={handleCreateBulk} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Origin City</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Destination City</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Number of Packages</label>
                  <input
                    type="number"
                    value={shipmentCount}
                    onChange={(e) => setShipmentCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Total Batch Weight (kg)</label>
                  <input
                    type="number"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-md"
                >
                  {loading ? 'Processing...' : 'Submit B2B Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
