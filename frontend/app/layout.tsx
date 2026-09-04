import './globals.css';
import type { Metadata } from 'next';
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
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased selection:bg-blue-100">
        <main className="flex-1 w-full">
          {children}
        </main>
        <AIChatBot />
      </body>
    </html>
  );
}
