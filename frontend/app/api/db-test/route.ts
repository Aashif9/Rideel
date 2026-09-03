import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const targetUrl = baseUrl.endsWith('/api') ? `${baseUrl}/db-test` : `${baseUrl}/api/db-test`;
    const res = await fetch(targetUrl, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to reach Rideel backend server at http://localhost:4000/api/db-test',
      error: error.message || 'Backend connection failed'
    }, { status: 502 });
  }
}
