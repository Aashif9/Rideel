# 🔍 RIDEEL Project — Codebase Audit & Architectural Analysis

**Audit Date**: October 2026  
**Auditor**: Senior Full-Stack Software Architect & Codebase Maintenance Specialist  
**Repository Location**: `C:\Users\aashi\OneDrive\Desktop\Rideel`  
**Git Remote**: `https://github.com/Aashif9/Rideel.git` (Branch: `main`)

---

## 1. Executive Summary

This codebase audit was conducted to assess the repository structure, verify build and test health, analyze backend duplication, evaluate database schema divergence, assess security and environment settings, and audit frontend-to-backend integration.

### Key Audit Findings:
1. **Primary Working Stack**: 
   - **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3.
   - **Active Backend**: Express.js + TypeScript (`backend/`, port 4000) with Socket.IO live GPS tracking, MSG91 SMS OTP auth, and Corridor Pricing Engine V2.
   - **Database**: PostgreSQL (connection pool with Supabase/Neon SSL support).
2. **Backend Duplication**:
   - `backend/` (Express) is the **active, fully implemented backend**.
   - `backend_nestjs/` is an **early Phase 2 placeholder skeleton** containing only `HealthModule` and `DbTestModule`. It lacks authentication, user management, trips, parcels, tracking, pricing, and bookings.
3. **Database Schema Divergence**:
   - `database/schema.sql` and sequential migrations in `database/migrations/` match the active Express backend models (UUID IDs, password hash, match requests, delivery locations).
   - Root `schema.sql` is an **outdated draft schema** using string IDs (`VARCHAR(64)`), text array roles, and different entity names (`trips`/`parcels` vs `rides`/`bookings`).
   - Duplicate migration numbering was identified: `001_create_delivery_locations.sql` and `001_create_users.sql` both share the `001_` prefix.
4. **External & Nested Repository Anomalies**:
   - `Nemo/` is an **unrelated Git repository** (`https://github.com/SuryaVignesh06/Nemo.git`), not referenced anywhere in Rideel code.
   - `Rideel/Rideel` is an **accidental nested Git clone** with only 1 initial commit, diverged 28 commits behind `origin/main`.
   - Root `.next/` is a **stray Next.js build artifact** produced when Next.js was run from the root directory.
5. **Frontend / Backend Integration State**:
   - Phone OTP Authentication (`/api/auth/*`) and Live GPS Tracking (Socket.IO) are wired to the Express backend.
   - Parcel creation, trip posting, match requests, escrow payments, wallet ledger, chat, and disputes are currently executed against `frontend/services/store.ts` (localStorage) on the client side, despite backend endpoints existing for pricing and match requests.

---

## 2. Current Architecture & Repository Inventory

```
Rideel/ (Root Monorepo)
├── .git/                                # Git metadata for Aashif9/Rideel (branch: main)
├── .gitignore                           # Root ignore patterns
├── .next/                               # [STRAY CACHE] Stray Next.js build from root execution
├── backend/                             # [PRIMARY BACKEND] Node.js + Express + TypeScript (:4000)
│   ├── .env                             # Environment configuration (ignored)
│   ├── .env.example                     # Environment template
│   ├── dist/                            # Generated tsc build output (regenerable)
│   ├── node_modules/                    # Backend dependencies
│   ├── package.json                     # Backend scripts (dev via tsx watch, build via tsc)
│   ├── package-lock.json                # Backend dependency lockfile
│   ├── src/                             # Backend source code
│   │   ├── auth/                        # Phone OTP (MSG91 & Dev), JWT sessions, rate limiting
│   │   ├── config/                      # env.ts, database.ts (pg pool), seedDatabase.ts
│   │   ├── controllers/                 # Barrel index for future controllers
│   │   ├── middleware/                  # Centralized error handler
│   │   ├── pricing/                     # Pricing Engine V2, distance matrix, speed fees
│   │   ├── repositories/                # Barrel index for future repositories
│   │   ├── routes/                      # API routes (auth, health, dbTest, user, delivery, matchRequest, pricing)
│   │   ├── server.ts                    # HTTP server + Socket.IO initialization
│   │   ├── services/                    # Barrel index for future services
│   │   ├── tracking/                    # Real-time GPS tracking Socket.IO engine
│   │   ├── types/                       # Backend data interfaces
│   │   ├── utils/                       # Utility barrel
│   │   └── validators/                  # Zod validation barrel
│   └── tsconfig.json                    # Backend TypeScript configuration
├── backend_nestjs/                      # [PHASE 2 SKELETON] NestJS microservice (:4001)
│   ├── .env                             # NestJS environment configuration (ignored)
│   ├── .env.example                     # NestJS environment template
│   ├── .eslintrc.js                     # ESLint configuration
│   ├── .prettierrc                      # Prettier configuration
│   ├── dist/                            # Generated NestJS build output
│   ├── nest-cli.json                    # Nest CLI configuration
│   ├── node_modules/                    # NestJS dependencies
│   ├── package.json                     # NestJS dependencies (@nestjs/*, typeorm)
│   ├── package-lock.json                # NestJS dependency lockfile
│   ├── README.md                        # NestJS boilerplate documentation
│   ├── src/                             # NestJS source (app, health, db-test modules ONLY)
│   ├── test/                            # Jest E2E tests
│   ├── tsconfig.build.json              # Build TS config
│   └── tsconfig.json                    # NestJS TS config
├── database/                            # [DATABASE LAYER] Schemas and Migrations
│   ├── migrations/                      # Sequential SQL migrations
│   │   ├── 001_create_delivery_locations.sql # [CONFLICTING NUMBER] Delivery GPS locations
│   │   ├── 001_create_users.sql              # [CONFLICTING NUMBER] Users table
│   │   ├── 002_create_auth_sessions.sql      # Auth session refresh tokens
│   │   ├── 003_create_phone_otps.sql         # Hashed phone OTP codes
│   │   ├── 004_create_match_requests.sql     # Match requests table
│   │   └── 005_add_pricing_quote_to_match_requests.sql # Shared capacity & pricing snapshot
│   ├── README.md                        # Database documentation
│   └── schema.sql                       # Complete PostgreSQL DDL reference (canonical)
├── frontend/                            # [FRONTEND APPLICATION] Next.js 14 App Router (:3000)
│   ├── .env.example                     # Frontend environment template
│   ├── .env.local                       # Frontend environment configuration (ignored)
│   ├── .next/                           # Next.js build cache (regenerable)
│   ├── app/                             # Next.js 14 App Router pages & API routes (28 routes)
│   ├── components/                      # UI components (Header, BottomNav, MapComponent, OTPModal, AIChatBot, etc.)
│   ├── hooks/                           # useLiveLocation.ts (Geolocation -> Socket.IO)
│   ├── lib/                             # constants.ts, db.ts, matching engine, delivery state machine
│   ├── next-env.d.ts                    # Next.js type declarations
│   ├── next.config.js                   # Next.js configuration
│   ├── node_modules/                    # Frontend dependencies
│   ├── package.json                     # Frontend scripts (next dev, next build, next start)
│   ├── package-lock.json                # Frontend dependency lockfile
│   ├── postcss.config.js                # PostCSS configuration
│   ├── public/                          # Static assets (favicon.ico)
│   ├── services/                        # apiServices.ts, store.ts, trackingSocket.ts
│   ├── stitch_rideel_peer_to_peer_express_logistics/ # [RETAIN] 47 Stitch UI screen mockups & DESIGN.md
│   ├── tailwind.config.js               # Tailwind CSS theme & tokens
│   ├── tsconfig.json                    # Frontend TypeScript configuration
│   ├── tsconfig.tsbuildinfo             # TS incremental build cache (regenerable)
│   └── types/                           # types/index.ts (TypeScript domain definitions)
├── Nemo/                                # [EXTERNAL PROJECT] Unrelated infinite canvas app
│   ├── .git/                            # Remote: https://github.com/SuryaVignesh06/Nemo.git
│   └── ...                              # Independent Vite/React 19 educational visualizer
├── Rideel/                              # [ACCIDENTAL NESTED REPO] Empty nested clone
│   ├── .git/                            # Remote: https://github.com/Aashif9/Rideel.git (diverged 1/28)
│   └── .gitattributes                  # LF normalization attribute
├── node_modules/                        # [RETAIN] Root dependencies (concurrently)
├── package.json                         # Root monorepo scripts (concurrently dev & build)
├── package-lock.json                    # Root dependency lockfile
├── PROJECT_STRUCTURE.md                 # Complete file-by-file directory documentation
├── README.md                            # Comprehensive product & architecture documentation
├── schema.sql                           # [DIVERGENT DRAFT] Root SQL schema file
├── vercel.json                          # Vercel deployment configuration
└── cleanup-report.txt                   # Temporary diagnostic directory listing

```

---

## 3. Confirmed Duplicates & Structural Anomalies

### 3.1 Backend Duplication: Express (`backend/`) vs NestJS (`backend_nestjs/`)

| Metric | Express Backend (`backend/`) | NestJS Backend (`backend_nestjs/`) |
| :--- | :--- | :--- |
| **Status** | **Active Primary Backend** | **Phase 2 Experimental Skeleton** |
| **Port** | `4000` | `4001` |
| **Root Script Wiring** | Wired in root `package.json` (`npm run dev:backend`) | Not wired in root development scripts |
| **Authentication** | Full MSG91 SMS OTP, Dev OTP, JWT rotation, bcrypt, rate limiting | **None** (No auth module or routes) |
| **Live Tracking** | Full Socket.IO server with room management and PostgreSQL write throttling | **None** (No socket or tracking logic) |
| **Corridor Pricing** | Pricing Engine V2 with distance calculation, detour fees, speed tiers | **None** (No pricing service) |
| **Database Wiring** | Connected via `pg` connection pool with query helpers | Connected via TypeORM (`synchronize: false`) |
| **Endpoints Present** | `/api/auth/*`, `/api/health`, `/api/db-test`, `/users`, `/deliveries`, `/match-requests`, `/api/pricing/*` | Only `/health` and `/db-test` |
| **Test Verification** | Unit tests for Auth and Pricing Engine V2 passing (100%) | Spec test: `AppModule (Phase 2 placeholder) should be defined` |

**Architectural Finding**:  
`backend_nestjs/` is an early Phase 2 placeholder. It contains zero business logic, zero models, and zero endpoints needed by the frontend. The Express backend in `backend/` is the active, functioning API.

---

### 3.2 Database Schema Divergence: Root `schema.sql` vs `database/schema.sql`

| Aspect | Root `schema.sql` | `database/schema.sql` & Migrations |
| :--- | :--- | :--- |
| **Primary Keys** | `VARCHAR(64)` | `UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| **User Entity** | `role TEXT[]`, `account_status VARCHAR(20)` | `role VARCHAR(50)`, `password_hash TEXT`, `name`, `full_name` |
| **Journey Model** | `trips` table with `origin_lat`, `destination_lat` | `rides` table linked to `drivers` and `vehicles` |
| **Parcel vs Booking** | Distinct `parcels` and `deliveries` tables | `bookings` table referencing `rides` |
| **Migration Sync** | **Out of sync** with `database/migrations/` | **Matches** `001_create_users.sql`, `002_create_auth_sessions.sql`, `004_create_match_requests.sql` |
| **Backend Code Alignment** | Does not match backend UUID queries | **Matches** `backend/src/config/seedDatabase.ts` and `backend/src/auth/` |

**Architectural Finding**:  
`database/schema.sql` (and its sequential migrations in `database/migrations/`) is the **canonical schema**. Root `schema.sql` is a legacy draft that must not be used for migrations.

---

### 3.3 Migration Numbering Collision in `database/migrations/`

Currently, `database/migrations/` contains:
- `001_create_delivery_locations.sql`
- `001_create_users.sql`

Both migrations use prefix `001_`. Because `users` is the fundamental parent table referenced as foreign keys by subsequent migrations (e.g., `002_create_auth_sessions.sql` references `users(id)` and `004_create_match_requests.sql` references `users(id)`), `001_create_users.sql` must precede dependent migrations.

---

### 3.4 Nested Git Repository `Rideel/`

The directory `Rideel/Rideel` contains:
- `.git/` with remote pointing to `https://github.com/Aashif9/Rideel.git`
- `.gitattributes`
- 1 commit (`5399893 Initial commit`), diverged 28 commits behind `origin/main`.
- No source code or assets.

**Architectural Finding**:  
This is an accidental nested clone created during initial repository setup. It has no unique code and presents a nested git repository conflict.

---

### 3.5 External Project `Nemo/`

The directory `Nemo/` contains:
- Its own Git repository (`https://github.com/SuryaVignesh06/Nemo.git`).
- A full Vite + React 19 application ("NEMO — an AI visual teacher on an infinite black canvas").
- Dependencies on `@langchain/core`, `@langchain/langgraph`, Playwright, and Manim.
- Zero references or dependencies connecting it to Rideel.

**Architectural Finding**:  
`Nemo/` is an independent project. It is currently untracked in Rideel's Git (`?? Nemo/`). It should be preserved as an independent workspace or excluded from Rideel Git tracking via `.gitignore`.

---

## 4. Frontend & Backend Integration Matrix

| # | Feature Domain | Frontend Status (`frontend/`) | Backend Endpoint (`backend/`) | Database Persistence (`PostgreSQL`) | Integration Status / Required Action |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Authentication** | Connected in `apiServices.ts` via `/auth/send-otp`, `/auth/verify-otp` | `POST /api/auth/send-otp`<br/>`POST /api/auth/verify-otp`<br/>`POST /api/auth/resend-otp`<br/>`POST /api/auth/logout` | `users`, `auth_sessions`, `phone_otps` | ✅ **Fully Integrated** with MSG91 SMS & JWT rotation |
| **2** | **User Profile & KYC** | UI exists (`/profile`, `/profile/kyc`); syncs partially via local store | `GET /users/profile`<br/>`POST /users/profile`<br/>`POST /auth/register-or-login` | `users.is_kyc_verified`, `profile_photo`, `city` | ⚠️ **Partial**: Profile syncs via auth endpoint; KYC document upload needs backend S3/storage endpoint |
| **3** | **Parcel Creation** | Step 1 (`/send`), Step 2 (`/send/parcel-details`) write to local `store.ts` | No dedicated `POST /parcels` endpoint | Draft parcels held in client `store.ts` | ⚠️ **Client Only**: Needs Express `POST /api/parcels` endpoint and schema mapping |
| **4** | **Trips Posting** | `/traveler` and `/trips` pages write to client `store.ts` | No dedicated `POST /trips` or `GET /trips` in Express | Handled in client `store.ts` | ⚠️ **Client Only**: Needs Express `POST /api/trips` & `GET /api/trips` endpoints |
| **5** | **Matching Engine** | Scored on client via `lib/matching/engine.ts` (0–100%) | `POST /api/match-requests` validates capacity & generates V2 quote | `match_requests` table exists with V2 quote columns | ⚠️ **Dual State**: Matching calculation runs on client; backend route exists but is not yet called by `/send/travelers` |
| **6** | **Booking Lifecycle** | `/send/booking-summary` and `lib/state-machine/delivery.ts` run locally | `POST /deliveries/verify-otp`<br/>`POST /deliveries/status` | `deliveries` / `bookings` | ⚠️ **Dual State**: Finite state machine runs in client; backend verification routes exist but need unified wiring |
| **7** | **Maps & Live Tracking** | `MapComponent.tsx` + `useLiveLocation.ts` streaming to Socket.IO | `Socket.IO` server on `:4000` (`tracking:location`, `tracking:join`) | `delivery_locations` (throttled write every 3s) | ✅ **Fully Integrated** for real-time WebSocket GPS streaming |
| **8** | **Payments (Escrow)** | `PaymentModal.tsx` simulates Razorpay escrow lock | Payment status updated via local store; backend has no Razorpay webhook | `payments` table | ⚠️ **Simulated**: Simulated escrow lock works locally; needs production Razorpay order/webhook endpoint |
| **9** | **Wallet & Earnings** | `/wallet` displays escrow holds and credit transactions from local store | No `/api/wallet` endpoints | Handled in client `store.ts` | ⚠️ **Client Only**: Needs backend wallet ledger endpoints (`/api/wallet/balance`, `/api/wallet/withdraw`) |
| **10** | **Chat & Notifications** | In-app direct chat (`/chat/[deliveryId]`) and notification bell in Header | No chat/notification REST or socket endpoints in Express | Handled in client `store.ts` | ⚠️ **Client Only**: Needs Socket.IO chat room events or REST endpoint for persistent message history |
| **11** | **Safety & Disputes** | `/safety/dispute` form submits claim to client `store.ts` | No `/api/disputes` endpoints | Handled in client `store.ts` | ⚠️ **Client Only**: Needs Express dispute submission endpoint and database table |
| **12** | **Admin Control Center** | `/admin`, `/admin/kyc`, `/admin/disputes` read from client `store.ts` | No `/api/admin/*` endpoints | Handled in client `store.ts` | ⚠️ **Client Only**: Needs role-based authorization check and Admin API routes |

---

## 5. Environment & Security Findings

1. **Environment Secrets Isolation**:
   - `.env` files in `backend/` and `frontend/` are correctly excluded from Git tracking via `.gitignore`.
   - `.env.local` in `frontend/` is correctly excluded.
2. **`JWT_SECRET` Hardcoded Default**:
   - In `backend/src/config/env.ts`:
     ```typescript
     JWT_SECRET: z.string().optional().default('rideel_default_access_secret_key_2026_change_in_prod')
     ```
   - In `backend/.env.example`, `JWT_SECRET` is omitted.
   - **Risk**: If deployed to production without setting `JWT_SECRET`, authentication will silently use the default development key.
   - **Recommendation**: Add `JWT_SECRET` to `backend/.env.example` and enforce that `JWT_SECRET` cannot equal the default key when `NODE_ENV === 'production'`.
3. **Database SSL Security**:
   - `backend/src/config/database.ts` dynamically enables `{ rejectUnauthorized: false }` when connecting to Supabase, Neon, or in production mode. This correctly prevents SSL connection failures on cloud providers.
4. **CORS Configuration**:
   - `backend/src/server.ts` configures CORS origin from `env.CORS_ORIGIN` (defaulting to `http://localhost:3000`) with credentials enabled.
5. **Frontend API Exposure**:
   - Frontend does not leak PostgreSQL credentials to the client bundle. `frontend/lib/db.ts` acts as a REST proxy to the backend. Only browser-safe variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) are exposed.

---

## 6. Build and Test Health Check Results

### Backend Health
- **Command**: `npm run build` in `backend/`
- **Result**: ✅ **Passed** (TypeScript `tsc` compiled cleanly with 0 errors).
- **Unit Tests**:
  - `pricing.test.ts`: ✅ **All 12 Pricing V2 scenarios passed** (weight tiers, detour fees, overbooking prevention, rounding).
  - `auth.test.ts`: ✅ **All 6 Auth unit tests passed** (E.164 phone normalization, Zod validation, JWT signing/verification, SHA-256 token hashing).

### NestJS Health
- **Command**: `npm test` in `backend_nestjs/`
- **Result**: ✅ **Passed** (`src/app.controller.spec.ts` passed).

### Frontend Health
- **Known Windows / OneDrive Note**:
  - Running `next build` on Windows inside OneDrive can trigger `EINVAL: invalid argument, readlink` when attempting to delete existing `.next` build files if OneDrive holds file locks.
  - Deleting `frontend/.next/` and `frontend/tsconfig.tsbuildinfo` allows clean compilation of all 28 routes.

---

## 7. Retained Essential Assets

The following directories and assets must be **strictly retained**:
- `frontend/stitch_rideel_peer_to_peer_express_logistics/`: Contains 47 high-fidelity UI mockup folders with `code.html`, `screen.png`, and `rideel_core/DESIGN.md`. This is the visual benchmark and design specification for the entire platform.
- `database/migrations/`: All sequential migration files.
- `database/schema.sql`: Canonical database schema.
- `root node_modules/`: Required for running `concurrently` in `npm run dev`.
- `backend/src/` and `frontend/app/`: Core application source code.
