'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Navigation, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Deliveries', href: '/deliveries', icon: Package },
    { label: 'Trips', href: '/trips', icon: Navigation },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Profile', href: '/profile', icon: User },
  ];

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
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
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
