'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-black text-slate-900">Application Error</h2>
          <p className="text-xs text-slate-500">{error?.message || 'A global error occurred.'}</p>
          <button
            onClick={() => reset()}
            className="w-full bg-[#002b5c] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
