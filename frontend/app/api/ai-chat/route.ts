import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const userQuery = (message || '').trim();

    // 1. Resolve GEMINI_API_KEY from environment or read directly from .env.local
    let geminiApiKey = process.env.GEMINI_API_KEY || '';
    if (!geminiApiKey) {
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');
          const match = content.match(/GEMINI_API_KEY=(.+)/);
          if (match && match[1]) {
            geminiApiKey = match[1].trim();
          }
        }
      } catch (e) {
        console.error('Error reading GEMINI_API_KEY from disk:', e);
      }
    }

    let reply = '';
    let quickActions: Array<{ label: string; href: string }> = [];

    // 2. If Gemini API Key is configured, execute live Google Gemini AI request
    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are RIDEEL Express AI Assistant, an expert AI agent for RIDEEL — a peer-to-peer intercity express logistics platform connecting parcel senders with verified travelers.

RIDEEL Platform Knowledge:
- Tagline: "Your route. Their parcel. Same day."
- Active Parcel Demo: Delivery ID RD784521 (Vijayawada -> Hyderabad), Traveler: Vikram Singh, Status: IN_TRANSIT, ETA: 12:15 PM, Pickup OTP: 482910.
- Security: 100% Escrow protection (funds held until receiver verifies Delivery OTP). Mandatory 6-digit Pickup OTP & Delivery OTP.
- Traveler Earnings: Travelers post trips with available carrying capacity (kg) and rate per kg. Payouts credited to wallet upon OTP verification.
- Prohibited Cargo: Narcotics, explosives, weapons, flammable liquids, unregistered currency, perishable food.
- B2B Portal: Bulk shipment dispatches for recurring corporate routes.

Instructions:
Respond concisely, professionally, and helpfully using clear formatting with markdown bolding (**text**) and bullet points where helpful.
User question: "${userQuery}"`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        reply = response.text();
      } catch (geminiError: any) {
        console.warn('Gemini API execution error, falling back to logistics rule engine:', geminiError?.message);
      }
    }

    // 3. Fallback / Rule-based Assistant Logic if Gemini API key is unconfigured or rate limited
    if (!reply) {
      const queryLower = userQuery.toLowerCase();
      if (queryLower.includes('status') || queryLower.includes('track')) {
        reply = "📦 Enter your 8-character Delivery ID (e.g. RD102938) on the tracking page to view real-time live GPS tracking and traveler location on Google Maps.";
        quickActions = [
          { label: 'View Deliveries', href: '/deliveries' }
        ];
      } else if (queryLower.includes('otp') || queryLower.includes('verification')) {
        reply = "🔒 **RIDEEL Double OTP Security System**:\n\n1. **Pickup OTP**: Given by sender to traveler during parcel pickup.\n2. **Receiver Delivery OTP**: Given by receiver to traveler at destination to verify delivery & release escrow funds.";
        quickActions = [{ label: 'View Deliveries', href: '/deliveries' }];
      } else if (queryLower.includes('send') || queryLower.includes('parcel')) {
        reply = "🚀 **Sending a Parcel on RIDEEL**:\n\n1. Select intercity origin & destination.\n2. Enter parcel details, weight (kg) & optional protection insurance.\n3. Pick from top matched travelers ranked by RIDEEL Match Score.\n4. Pay via 100% Escrow and receive your Pickup OTP!";
        quickActions = [{ label: 'Send a Parcel Now', href: '/send' }];
      } else if (queryLower.includes('earn') || queryLower.includes('traveler') || queryLower.includes('post trip')) {
        reply = "🚗 **Earn Money While Traveling**:\nPost your intercity route, set your capacity (kg) and rate per kg. Accept matching parcel requests along your route, verify OTPs, and get instant wallet payouts.";
        quickActions = [
          { label: 'Post a Trip', href: '/trips' },
          { label: 'View Wallet', href: '/wallet' }
        ];
      } else if (queryLower.includes('prohibited') || queryLower.includes('restricted')) {
        reply = "🚫 **Prohibited Cargo on RIDEEL**:\nExplosives, illegal narcotics, firearms, flammable liquids, and uncertified cash are strictly prohibited.";
        quickActions = [{ label: 'Safety Rules', href: '/safety' }];
      } else {
        reply = `Hello! I am **RIDEEL Express AI Assistant** 🤖. Powered by Google Gemini AI, I can help you track intercity parcels, explain OTP handoffs, calculate traveler earnings, or inspect safety rules. How can I help you today?`;
        quickActions = [
          { label: 'Send Parcel', href: '/send' },
          { label: 'Post Trip', href: '/trips' },
          { label: 'Safety Rules', href: '/safety' }
        ];
      }
    }

    // Dynamic quick actions mapping if not explicitly assigned
    if (quickActions.length === 0) {
      const q = userQuery.toLowerCase();
      if (q.includes('track') || q.includes('status')) {
        quickActions = [{ label: 'Track Delivery', href: '/deliveries/RD784521' }];
      } else if (q.includes('earn') || q.includes('trip')) {
        quickActions = [{ label: 'Post Trip', href: '/trips' }];
      } else {
        quickActions = [
          { label: 'Send Parcel', href: '/send' },
          { label: 'Safety Rules', href: '/safety' }
        ];
      }
    }

    return NextResponse.json({
      reply,
      quickActions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI engine error' }, { status: 500 });
  }
}
