import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (baseUrl) {
      const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/db-test` : `${baseUrl}/api/db-test`;
      const res = await fetch(targetUrl, { cache: 'no-store' });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (error: any) {
    // Backend offline / detached; fallback to standalone status
  }

  return NextResponse.json({
    success: true,
    mode: 'STANDALONE_FRONTEND',
    message: 'Rideel Frontend is running independently in standalone demo mode. Backend API is detached and ready for rebuild.',
    timestamp: new Date().toISOString()
  });
}
