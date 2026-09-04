'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { User as UserType } from '@/types';
import { Home, Package, Navigation, Wallet, User, Inbox, PlusCircle, Send } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    apiServices.getCurrentUser().then(setUser);
  }, []);

  // Hide on admin routes or login
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  const isTravelerMode = user?.active_mode === 'traveler';

  const senderNavItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Send', href: '/send', icon: Send },
    { label: 'Deliveries', href: '/deliveries', icon: Package },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const travelerNavItems = [
    { label: 'Home', href: '/traveler', icon: Home },
    { label: 'Post Route', href: '/trips', icon: PlusCircle },
    { label: 'Requests', href: '/traveler/requests', icon: Inbox },
    { label: 'Earnings', href: '/wallet', icon: Wallet },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const navItems = isTravelerMode ? travelerNavItems : senderNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-container-high py-2 px-4 z-40 md:hidden shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition ${
                isActive ? (isTravelerMode ? 'text-emerald-600 font-extrabold' : 'text-primary font-extrabold') : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    isTravelerMode ? 'bg-emerald-600' : 'bg-primary'
                  }`}></span>
                )}
              </div>
              <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
