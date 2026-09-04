'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { User, AppNotification } from '@/types';
import { Bell, ShieldCheck, User as UserIcon, Building2, Package, Truck, LayoutDashboard, LogIn, Inbox } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
    apiServices.getNotifications().then(setNotifications);
  }, []);

  if (pathname === '/login') return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleModeSwitch = async (newMode: 'sender' | 'traveler') => {
    const updatedUser = await apiServices.switchUserMode(newMode);
    setUser({ ...updatedUser });
    if (newMode === 'traveler') {
      router.push('/traveler');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-surface-container-high z-40 px-4 py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href={user?.active_mode === 'traveler' ? '/traveler' : '/'} className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition">
            R
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-primary block leading-none">RIDEEL</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">Peer-to-Peer Logistics</span>
          </div>
        </Link>

        {/* Central Mode Switcher Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
          <button
            onClick={() => handleModeSwitch('sender')}
            className={`px-3 py-1.5 text-xs font-black rounded-full transition-all flex items-center gap-1.5 ${
              user?.active_mode !== 'traveler'
                ? 'bg-[#002b5c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Sender Mode</span>
          </button>

          <button
            onClick={() => handleModeSwitch('traveler')}
            className={`px-3 py-1.5 text-xs font-black rounded-full transition-all flex items-center gap-1.5 ${
              user?.active_mode === 'traveler'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Traveler Mode</span>
          </button>
        </div>

        {/* Navigation Links according to persona */}
        <div className="hidden lg:flex items-center gap-5">
          {user?.active_mode === 'traveler' ? (
            <>
              <Link href="/traveler" className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition">
                Dashboard
              </Link>
              <Link href="/trips" className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition">
                Post Route
              </Link>
              <Link href="/traveler/requests" className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition flex items-center gap-1">
                <Inbox className="w-3.5 h-3.5" /> Incoming Requests
              </Link>
              <Link href="/wallet" className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition">
                Earnings
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-xs font-bold text-slate-700 hover:text-primary transition">
                Deliveries
              </Link>
              <Link href="/send" className="text-xs font-bold text-slate-700 hover:text-primary transition">
                Send Parcel
              </Link>
              <Link href="/send/travelers" className="text-xs font-bold text-slate-700 hover:text-primary transition">
                Find Travelers
              </Link>
              <Link href="/business" className="text-xs font-bold text-slate-700 hover:text-primary transition">
                B2B Logistics
              </Link>
            </>
          )}

          {user?.role?.includes('admin') && (
            <Link
              href="/admin"
              className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 hover:bg-amber-100 transition flex items-center gap-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-surface-container text-slate-700 relative transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-surface-container-high p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-primary">Notifications</h4>
                  <span className="text-xs bg-surface-container px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 text-xs rounded-lg hover:bg-surface-container-low border border-slate-100">
                        <div className="font-bold text-slate-800">{n.title}</div>
                        <div className="text-slate-600 mt-0.5">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition border border-primary/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Login / Switch</span>
          </Link>

          {user && (
            <Link href="/profile" className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-surface-container transition border border-surface-container-high">
              <img
                src={user.profile_photo}
                alt={user.full_name}
                className="w-7 h-7 rounded-full object-cover border border-primary"
              />
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">{user.full_name.split(' ')[0]}</span>
              {user.is_kyc_verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
