import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  let apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

  // If process.env hasn't picked up .env.local yet without server restart, read directly from file
  if (!apiKey) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.+)/);
        if (match && match[1]) {
          apiKey = match[1].trim();
        }
      }
    } catch (e) {
      console.error('Error reading .env.local from disk:', e);
    }
  }

  return NextResponse.json({
    googleMapsApiKey: apiKey
  });
}
