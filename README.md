# 🚚 RIDEEL — Peer-to-Peer Same-Day Intercity Parcel Delivery Platform

> **"Your route. Their parcel. Same day."**

RIDEEL is a full-stack peer-to-peer intercity logistics platform connecting parcel senders with verified travelers who are already traveling on the same route with unused luggage or vehicle capacity.

---

## 📑 Table of Contents
- [1. Executive Product Overview](#1-executive-product-overview)
- [2. Technology Stack & Architecture](#2-technology-stack--architecture)
- [3. Key User Roles & Workflows](#3-key-user-roles--workflows)
- [4. RIDEEL Intelligent Matching Engine](#4-rideel-intelligent-matching-engine)
- [5. Delivery Lifecycle & State Machine](#5-delivery-lifecycle--state-machine)
- [6. Security, OTP & Escrow Payment System](#6-security-otp--escrow-payment-system)
- [7. B2B Corporate Portal & Desktop Admin Dashboard](#7-b2b-corporate-portal--desktop-admin-dashboard)
- [8. Project Directory Structure](#8-project-directory-structure)
- [9. Environment Configuration](#9-environment-configuration)
- [10. Quickstart & Local Installation](#10-quickstart--local-installation)
- [11. Testing & Google Maps Diagnostic Suite](#11-testing--google-maps-diagnostic-suite)

---

## 1. Executive Product Overview

Traditional courier services take 24–72 hours for intercity deliveries due to centralized hub sorting and intermediate warehousing. **RIDEEL** bypasses traditional hub bottlenecks by leveraging the unused carrying capacity of thousands of daily intercity travelers (cars, SUVs, trains, private carriers).

### Core Benefits:
- **Same-Day Intercity Handover**: Parcels travel directly with verified commuters on established highway corridors (e.g., Vijayawada ↔ Hyderabad, Mumbai ↔ Pune, Delhi ↔ Jaipur).
- **100% Escrow Financial Protection**: Sender payments are locked in escrow and only released to the traveler upon verified 6-digit Receiver OTP handover at the destination.
- **Dual OTP Handover Verification**: Eliminates lost parcel disputes via mandatory 6-digit Pickup OTP (Sender → Traveler) and Delivery OTP (Receiver → Traveler).
- **KYC & Safety Protection**: Multi-step identity verification (Aadhaar/Passport & Selfie), prohibited cargo enforcement, and optional parcel insurance coverage.

---

## 2. Technology Stack & Architecture

RIDEEL is engineered as a production-structured full-stack Next.js application with decoupled business logic, relational data modeling, and modern visual design tokens.

### 🎨 Frontend & UI Architecture
| Technology | Version / Tool | Purpose in RIDEEL |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Server-Side Rendering (SSR), Client Components, React Server Components, API Routes |
| **Library** | React 18 | Component-based UI architecture, Hooks state management (`useState`, `useRef`, `useEffect`) |
| **Language** | TypeScript 5 | Strict static typing across all DB models, state transitions, API payloads, and props |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design based on 1:1 Stitch UI visual tokens |
| **Iconography** | Lucide React | Clean, scalable logistics SVG icons (`Package`, `Truck`, `ShieldCheck`, `KeyRound`, `MapPin`) |
| **CSS Processing** | PostCSS 8 + Autoprefixer 10 | Cross-browser CSS prefixing, custom scrollbars, glassmorphism, and timeline connectors |

### 🗺️ Maps & Location System
| Technology | Package | Description |
| :--- | :--- | :--- |
| **Google Maps JS API** | `@googlemaps/js-api-loader` v2 | Functional API (`setOptions`, `importLibrary`) loading real Google Maps tiles, custom dark logistics theme |
| **Places Autocomplete** | `google.maps.places.Autocomplete` | Real-time Indian city & location search returning Place ID, Lat/Lng, and formatted addresses |
| **Directions & Routing** | `google.maps.DirectionsService` | Driving path calculation, real distance (`km`), estimated duration, and polyline rendering |
| **Fallback Map Engine** | Custom SVG Canvas | Interactive animated SVG map layer ensuring 100% demoable offline fallback if no API key is set |

### ⚙️ Backend & Persistence Architecture
| Layer | Tech / Abstraction | Description |
| :--- | :--- | :--- |
| **API Endpoints** | Next.js App Router (`/api/*`) | Route handlers for configuration, auth, matching, bookings, OTP verification, and payouts |
| **Database Schema** | PostgreSQL / Supabase ready | Relational entities (`users`, `trips`, `parcels`, `deliveries`, `payments`, `wallet_transactions`, `disputes`, `kyc`) |
| **Reactive Local Store** | `services/store.ts` | LocalStorage + memory synchronization layer allowing instant out-of-the-box demo persistence without external DB setup |
| **Service Layer** | `services/apiServices.ts` | Fully decoupled business logic modules (`authService`, `tripService`, `matchingService`, `deliveryService`, `walletService`, `adminService`) |

---

## 3. Key User Roles & Workflows

RIDEEL supports three main customer roles, allowing normal users to seamlessly toggle between **Sender** and **Traveler** modes without creating separate accounts:

### 1. 📦 SENDER WORKFLOW
1. **Route Selection**: Choose intercity origin, destination, dispatch date, and pickup/delivery preferences (Direct Handoff vs. Partner Drop Hub).
2. **Parcel Details**: Define category (Document, Small Pack, Medium Box), weight (kg), dimensions (l x w x h), contents description, declared value (₹), and parcel protection insurance opt-in.
3. **Prohibited Items Warning**: Mandatory checkbox confirmation agreeing that the parcel contains no restricted cargo (explosives, narcotics, cash, weapons).
4. **Matching Travelers**: View ranked traveler list with RIDEEL Match Scores (e.g. 96% Match), price per kg, traveler star ratings, and completed delivery badges.
5. **Booking Summary**: View transparent price breakdown (Traveler Fee + Rideel Service Fee ₹15 + Insurance ₹10).
6. **Simulated Escrow Payment**: Execute payment via simulated Razorpay gateway (funds held securely in `ESCROW_HELD`).
7. **Pickup & Tracking**: Receive 6-digit Pickup OTP to give traveler upon handover, then track live GPS progress along highway corridor.
8. **Rating & Review**: Leave a 1–5 star rating with tags (*On Time*, *Professional*, *Safe*) after successful delivery.

### 2. 🚗 TRAVELER WORKFLOW
1. **Post a Trip**: Specify origin, destination, travel date, departure time, estimated arrival, vehicle type (Car, SUV, Bike, Truck), total capacity (kg), max weight per item, and price per kg.
2. **Accept Parcel Requests**: Review incoming parcel match requests showing sender profile, parcel weight, pickup/drop details, and net traveler payout.
3. **Trip Control Center**: View live route map, update trip milestones (*Trip Started*, *Arrived at Pickup*, *In Transit*, *Arrived at Destination*).
4. **Handoff Verification**: Input 6-digit **Pickup OTP** from sender to start transit, and **Delivery OTP** from receiver to complete delivery.
5. **Earnings Wallet**: Instant payout credit (e.g. ₹120) upon successful delivery OTP verification, available for bank cashout.

### 3. 🏢 BUSINESS (B2B) WORKFLOW (`/business`)
1. **Corporate Dashboard**: Track total corporate shipments, active dispatches, monthly logistics spend, and SLA success rates.
2. **Bulk Shipment Orders**: Dispatch multi-parcel batches across recurring corridors (e.g. Mumbai ↔ Pune dispatches).

### 4. 🛡️ ADMIN CONTROL CENTER (`/admin`)
1. **Master Dashboard**: View real-time database stats (total users, active travelers, active deliveries, platform commission revenue).
2. **KYC Approvals Queue (`/admin/kyc`)**: Review uploaded government IDs (Aadhaar / Passport) and selfie photos; approve or reject verification status.
3. **Dispute Resolution (`/admin/disputes`)**: Arbitrate lost/damaged parcel claims with full refund or traveler payout authorization.

---

## 4. RIDEEL Intelligent Matching Engine

Located in `lib/matching/engine.ts`, the matching engine calculates a weighted match percentage score (0 – 100%) to pair parcels with optimal travelers:

$$\text{Match Score} = \text{Route (40\%)} + \text{Date (20\%)} + \text{Capacity/Weight (15\%)} + \text{Timing (10\%)} + \text{Rating (10\%)} + \text{KYC Bonus (5\%)}$$

### Matching Criteria Breakdown:
- **Route Compatibility (40%)**: 40% for direct origin & destination city match; 20% for corridor alignment.
- **Travel Date (20%)**: 20% for exact same-day alignment; 12% if within 24 hours.
- **Capacity & Weight (15%)**: Verified if traveler available capacity $\ge$ parcel weight AND max weight per item is respected.
- **Departure Timing (10%)**: Evaluates departure window feasibility.
- **Traveler Rating (10%)**: Pro-rated star rating score ($\frac{\text{Rating}}{5.0} \times 10$).
- **Verification Bonus (5%)**: Bonus for KYC and identity-verified travelers.

---

## 5. Delivery Lifecycle & State Machine

Enforced by `lib/state-machine/delivery.ts`, status transitions must follow strict state machine constraints:

```
[BOOKED] ──> [ACCEPTED] ──> [PICKUP_PENDING] ──(Pickup OTP Verified)──> [PICKED_UP]
                                                                            │
[PAYMENT_RELEASED] <── [DELIVERED] <──(Delivery OTP Verified)── [IN_TRANSIT]
```

### State Definitions:
- `BOOKED`: Sender created booking; traveler capacity reserved.
- `ACCEPTED` / `ESCROW_HELD`: Escrow payment completed by sender.
- `PICKUP_PENDING`: Traveler arrived at pickup location.
- `PICKED_UP`: Traveler entered valid 6-digit Pickup OTP code from sender.
- `IN_TRANSIT`: Courier actively traveling along highway route.
- `DELIVERY_PENDING`: Traveler arrived at destination location.
- `DELIVERED`: Traveler entered valid 6-digit Delivery OTP code from receiver.
- `PAYMENT_RELEASED`: Escrow funds released to traveler's withdrawable wallet balance.

---

## 6. Security, OTP & Escrow Payment System

### Escrow Financial Architecture (`services/paymentService.ts`)
- **Sender pays total fee**: e.g., ₹145 (₹120 Traveler Payout + ₹15 Platform Fee + ₹10 Insurance).
- Funds are locked in **`ESCROW_HELD`** status.
- Money is **NEVER** transferred directly to traveler beforehand.
- Upon successful **Delivery OTP** verification, status switches to **`RELEASED`**, and ₹120 is credited to traveler's available wallet balance.

### OTP Security Specifications
- **Pickup OTP**: 6-digit code generated for sender. Traveler inputs code at pickup.
- **Delivery OTP**: 6-digit code generated for receiver. Traveler inputs code at destination.
- **Demo Override**: For testing simplicity, `123456` can also be used as a universal demo OTP code.

---

## 7. B2B Corporate Portal & Desktop Admin Dashboard

### Business B2B Portal (`/business`)
- Multi-parcel bulk dispatches.
- Corporate shipment tracking ledger.
- Monthly logistics spend analytics.

### Admin Dashboard (`/admin`)
- Desktop-first management dashboard.
- Live database statistics.
- **KYC Review Queue (`/admin/kyc`)**: One-click ID approval / rejection.
- **Dispute Resolution Queue (`/admin/disputes`)**: Full refund vs. payout authorization controls.

---

## 8. Project Directory Structure

```
c:\Users\aashi\OneDrive\Desktop\Rideel\
├── app/
│   ├── (auth)/
│   ├── admin/
│   │   ├── page.tsx               # Admin Master Overview Dashboard
│   │   ├── kyc/page.tsx           # KYC Document Review & Approvals Queue
│   │   └── disputes/page.tsx      # Dispute Resolution & Refund Controls
│   ├── api/
│   │   └── config/route.ts        # Dynamic Server Config API endpoint
│   ├── business/
│   │   └── page.tsx               # B2B Corporate Bulk Shipments Portal
│   ├── chat/
│   │   └── [deliveryId]/page.tsx  # Delivery-Specific Sender <-> Traveler Chat
│   ├── debug/
│   │   └── maps/page.tsx          # Google Maps API Diagnostic & Testing Suite
│   ├── deliveries/
│   │   ├── page.tsx               # Active & Past Deliveries Overview
│   │   └── [id]/page.tsx          # Detailed Tracking Map & OTP Handoff
│   ├── profile/
│   │   ├── page.tsx               # User Profile & Settings Menu
│   │   └── kyc/page.tsx           # KYC Document Submission Page
│   ├── safety/
│   │   ├── page.tsx               # Safety Center & Prohibited Cargo Rules
│   │   └── dispute/page.tsx       # Report Issue / Dispute Filing Form
│   ├── send/
│   │   ├── page.tsx               # Step 1: Intercity Route & Handoff Selection
│   │   ├── parcel-details/page.tsx# Step 2: Parcel Dimensions, Value & Insurance
│   │   ├── travelers/page.tsx     # Step 3: Match Ranking & Traveler Selection
│   │   └── booking-summary/page.tsx# Step 4: Transparent Fee Breakdown & Escrow
│   ├── trips/
│   │   ├── page.tsx               # Traveler Trips Dashboard & Post Trip Modal
│   │   └── [id]/page.tsx          # Active Trip Control View with OTP Verification
│   ├── wallet/
│   │   └── page.tsx               # Wallet Balance, Escrow Ledger & Cashout Payout
│   ├── globals.css                # Tailwind directives & Stitch elevation styles
│   ├── layout.tsx                 # Root Layout with Header & Bottom Navigation
│   └── page.tsx                   # Main Home Dashboard
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Sticky Top Navigation with Mode Switcher & Bell
│   │   └── BottomNav.tsx          # Mobile Bottom Navigation Bar
│   ├── tracking/
│   │   ├── MapComponent.tsx       # Google Maps JS API component + Fallback SVG
│   │   └── OTPModal.tsx           # 6-Digit Handover OTP Verification Dialog
│   └── ui/
│       ├── DemoUserSwitcher.tsx   # 1-Click Preset Demo Context Switcher
│       └── PaymentModal.tsx       # Simulated Razorpay Escrow Payment Gateway
├── lib/
│   ├── database/                  # Schema definitions & migrations
│   ├── matching/
│   │   └── engine.ts              # Weighted Match Algorithm Engine
│   ├── state-machine/
│   │   └── delivery.ts            # Delivery Status Transition Validator
│   ├── constants.ts               # Indian Cities, Coordinates, Popular Routes, Presets
│   └── utils.ts                   # Utility functions & formatting helpers
├── services/
│   ├── apiServices.ts             # Service Layer encapsulating all DB & API logic
│   └── store.ts                   # Persistent reactive state DB synchronized with LocalStorage
├── types/
│   └── index.ts                   # TypeScript interfaces for all DB entities
├── public/
│   ├── favicon.ico                # App icon
│   └── assets/                    # Static graphics
├── .env.example                   # Environment variables template
├── .env.local                     # Local environment secrets
├── next.config.js                 # Next.js configuration
├── package.json                   # Project dependencies and scripts
├── postcss.config.js              # PostCSS plugins configuration
├── tailwind.config.js             # Stitch visual tokens configuration
└── tsconfig.json                  # TypeScript compiler rules
```

---

## 9. Environment Configuration

Copy `.env.example` to `.env.local` and add your Google Maps API key:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCQUWoNs3UQ_ZGQngImYO_oQOsafHTIv9w

# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Integration Key (Optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

---

## 10. Quickstart & Local Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.14.0 recommended)
- **npm**: v9.0.0 or higher

### Steps

1. **Clone or Navigate to Project Directory**:
   ```bash
   cd c:\Users\aashi\OneDrive\Desktop\Rideel
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 11. Testing & Google Maps Diagnostic Suite

RIDEEL includes an automated diagnostic suite to verify Google Maps API initialization, Places Autocomplete, and Directions Routing.

- Navigate to: **`http://localhost:3000/debug/maps`**

### What the Diagnostic Suite Tests:
1. **Google Maps JS API Loader**: Verifies key detection, script loading, and map canvas mounting.
2. **Vijayawada ↔ Hyderabad Corridor**: Automatically renders markers and driving polyline.
3. **Places Autocomplete Search**: Type any location in India in *From* and *To* fields to test place selection (returns Place ID, Lat/Lng, Address) and recalculates directions dynamically.
