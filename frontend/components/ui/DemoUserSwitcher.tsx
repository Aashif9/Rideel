'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { DEMO_PRESETS } from '@/lib/constants';
import { User } from '@/types';
import { UserCheck, Shield, Repeat, Sparkles } from 'lucide-react';

export default function DemoUserSwitcher({ onUserChanged }: { onUserChanged?: () => void }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    apiServices.getCurrentUser().then(setCurrentUser);
  }, []);

  const handleSwitch = async (userId: string) => {
    const updated = await apiServices.switchPresetUser(userId);
    setCurrentUser(updated);
    if (onUserChanged) onUserChanged();
    window.location.reload();
  };

  const handleModeSwitch = async (mode: 'sender' | 'traveler' | 'business') => {
    const updated = await apiServices.switchUserMode(mode);
    setCurrentUser({ ...updated });
    if (onUserChanged) onUserChanged();
    window.location.reload();
  };

  if (pathname === '/login' || !currentUser) return null;

  return (
    <div className="bg-primary text-white text-xs py-2 px-4 shadow-md flex flex-wrap items-center justify-between gap-2 border-b border-primary-container z-50">
      <div className="flex items-center gap-2">
        <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase text-[10px] tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> DEMO MODE
        </span>
        <span className="font-medium text-slate-200 hidden sm:inline">Active User:</span>
        <span className="font-bold text-amber-300 flex items-center gap-1">
          {currentUser.full_name} ({currentUser.active_mode.toUpperCase()})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-[11px] hidden md:inline">Quick Preset:</span>
        <select
          value={currentUser.id}
          onChange={(e) => handleSwitch(e.target.value)}
          className="bg-primary-container text-white text-xs rounded border border-on-primary-container px-2 py-1 focus:outline-none"
        >
          {DEMO_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id} className="bg-primary text-white">
              {preset.label}
            </option>
          ))}
        </select>

        {currentUser.role.includes('sender') && currentUser.role.includes('traveler') && (
          <div className="flex bg-primary-container rounded p-0.5 border border-on-primary-container">
            <button
              onClick={() => handleModeSwitch('sender')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentUser.active_mode === 'sender'
                  ? 'bg-amber-400 text-primary'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sender
            </button>
            <button
              onClick={() => handleModeSwitch('traveler')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentUser.active_mode === 'traveler'
                  ? 'bg-emerald-400 text-primary'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Traveler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
