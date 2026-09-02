import './globals.css';
import type { Metadata } from 'next';
import DemoUserSwitcher from '@/components/ui/DemoUserSwitcher';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import AIChatBot from '@/components/ui/AIChatBot';

export const metadata: Metadata = {
  title: 'RIDEEL — Peer-to-Peer Same-Day Intercity Parcel Delivery',
  description: 'Your route. Their parcel. Same day. RIDEEL connects intercity senders with verified travelers traveling on the same route with available capacity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-background text-on-background flex flex-col antialiased">
        <DemoUserSwitcher />
        <Header />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-8">
          {children}
        </main>
        <AIChatBot />
        <BottomNav />
      </body>
    </html>
  );
}
