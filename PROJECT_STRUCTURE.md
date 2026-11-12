# 📁 RIDEEL Platform — Complete Project Structure & File Guide

This document provides a comprehensive inventory and functional breakdown of every directory and file across the **RIDEEL** peer-to-peer express logistics repository.

---

## 🏗️ Architecture Overview

The workspace is architected as a monorepo consisting of:
1. **Frontend (`frontend/`)**: Next.js 14 (App Router) mobile-first web application, TypeScript, Tailwind CSS, Google Maps Loader, Gemini AI Chat, and Socket.IO client.
2. **Backend (`backend/`)**: Node.js + Express + TypeScript REST API and Socket.IO server handling live GPS tracking, MSG91 Phone OTP authentication, and dynamic highway pricing engine V2.
3. **Backend NestJS (`backend_nestjs/`)**: Enterprise NestJS microservice structure with TypeORM and class-validator.
4. **Database (`database/`)**: PostgreSQL schema definitions and sequential SQL migrations.
5. **UI Reference Library (`frontend/stitch_rideel_peer_to_peer_express_logistics/`)**: 47 Stitch UI screen mockups and design token definitions.
6. **Nemo (`Nemo/`)**: Standalone companion AI visual teacher application on an infinite canvas.

---

## 1. Root Directory Files

| File | Path | Description & Purpose |
| :--- | :--- | :--- |
| `package.json` | [package.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/package.json) | Monorepo root configuration. Runs both frontend (`:3000`) and backend (`:4000`) concurrently using `npm run dev`. |
| `package-lock.json` | [package-lock.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/package-lock.json) | Dependency lockfile ensuring consistent installations across environments. |
| `schema.sql` | [schema.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/schema.sql) | PostgreSQL DDL reference schema defining `users`, `drivers`, `vehicles`, `rides`, `bookings`, `payments`, `reviews`, and `notifications`. |
| `vercel.json` | [vercel.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/vercel.json) | Deployment configuration declaring Next.js framework build targeting for Vercel. |
| `README.md` | [README.md](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/README.md) | Comprehensive platform overview, executive summary, user workflows, matching algorithm breakdown, and quickstart documentation. |
| `.gitignore` | [.gitignore](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/.gitignore) | Git ignore rules excluding `node_modules`, `.next`, `dist`, `.env*`, and IDE caches. |

---

## 2. Express Backend (`backend/`)

A TypeScript Node.js backend providing real-time Socket.IO tracking, MSG91 SMS OTP verification, and corridor pricing calculations.

### Root Backend Configuration
- `backend/package.json` ([backend/package.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/package.json)): Configures backend scripts (`dev` via `tsx watch`, `build`, `start`) and dependencies (`express`, `socket.io`, `pg`, `zod`, `dotenv`, `cors`).
- `backend/tsconfig.json` ([backend/tsconfig.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/tsconfig.json)): Strict TypeScript compilation settings.
- `backend/.env` & `backend/.env.example` ([backend/.env.example](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/.env.example)): Environment configuration template (`DATABASE_URL`, `JWT_SECRET`, `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`, `PORT=4000`, `CORS_ORIGIN`).

### Server Entrypoint
- `backend/src/server.ts` ([server.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/server.ts)): Initializes HTTP server, mounts Socket.IO real-time tracking engine, sets CORS, aggregates routes, mounts error handler, and runs database auto-seeding.

### Configuration (`backend/src/config/`)
- `backend/src/config/env.ts` ([env.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/config/env.ts)): Validates and exports typed environment variables with fallback defaults.
- `backend/src/config/database.ts` ([database.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/config/database.ts)): Configures PostgreSQL `Pool` connection with automatic SSL for cloud providers (Supabase / Neon) and query execution helper.
- `backend/src/config/seedDatabase.ts` ([seedDatabase.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/config/seedDatabase.ts)): Seeds essential initial database records (demo users, active corridors) if the database is unpopulated.

### Authentication & SMS OTP (`backend/src/auth/`)
- `backend/src/auth/auth.routes.ts` ([auth.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/auth.routes.ts)): HTTP route handlers for `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/resend-otp`, `/api/auth/refresh-token`, `/api/auth/logout`, and `/api/auth/me`.
- `backend/src/auth/auth.service.ts` ([auth.service.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/auth.service.ts)): Orchestrates OTP dispatch, verification, user registration, JWT access/refresh token generation.
- `backend/src/auth/auth.middleware.ts` ([auth.middleware.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/auth.middleware.ts)): Express middleware verifying JWT Bearer tokens and applying IP rate limiting.
- `backend/src/auth/auth.types.ts` ([auth.types.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/auth.types.ts)): TypeScript interfaces for auth payloads, JWT claims, and session records.
- `backend/src/auth/auth.validation.ts` ([auth.validation.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/auth.validation.ts)): Zod schemas validating phone numbers, OTP codes, and refresh tokens.
- `backend/src/auth/otp.service.ts` ([otp.service.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/otp.service.ts)): Cryptographic 6-digit OTP generation, SHA-256 hashing, rate limiting, and attempt tracking in PostgreSQL.
- `backend/src/auth/session.service.ts` ([session.service.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/session.service.ts)): Manages persistent refresh token sessions, expiration dates, and revocation.
- `backend/src/auth/providers/otp-provider.interface.ts` ([otp-provider.interface.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/providers/otp-provider.interface.ts)): Interface defining the `IOTPProvider` contract (`sendOTP`).
- `backend/src/auth/providers/msg91-otp.provider.ts` ([msg91-otp.provider.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/providers/msg91-otp.provider.ts)): Production SMS provider communicating with MSG91 API.
- `backend/src/auth/providers/development-otp.provider.ts` ([development-otp.provider.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/providers/development-otp.provider.ts)): Local development provider printing OTP codes to the console without SMS costs.
- `backend/src/auth/providers/otp-provider.factory.ts` ([otp-provider.factory.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/auth/providers/otp-provider.factory.ts)): Factory creating MSG91 provider in production or development provider locally.

### Real-Time Live GPS Tracking (`backend/src/tracking/`)
- `backend/src/tracking/tracking.socket.ts` ([tracking.socket.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/tracking/tracking.socket.ts)): Socket.IO event handler managing rooms (`delivery:<id>`), location ingestion from travelers, and live broadcasting to senders/receivers.
- `backend/src/tracking/tracking.service.ts` ([tracking.service.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/tracking/tracking.service.ts)): In-memory cache for latest coordinates with throttled batch persistence to `delivery_locations` in PostgreSQL.
- `backend/src/tracking/tracking.types.ts` ([tracking.types.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/tracking/tracking.types.ts)): Socket event constants and location payload types (lat, lng, speed, heading, accuracy).
- `backend/src/tracking/tracking.validation.ts` ([tracking.validation.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/tracking/tracking.validation.ts)): Validates GPS coordinates and rejects spoofed or out-of-bounds coordinates.

### Dynamic Highway Pricing V2 (`backend/src/pricing/`)
- `backend/src/pricing/pricing.config.ts` ([pricing.config.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/pricing/pricing.config.ts)): Base rates, corridor payout tiers, platform commission percentages, and urgency/detour surcharges.
- `backend/src/pricing/pricing.service.ts` ([pricing.service.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/pricing/pricing.service.ts)): Distance calculation with highway curvature factor, traveler payout calculation, platform fee, and transparent price quote breakdowns.
- `backend/src/pricing/pricing.routes.ts` ([pricing.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/pricing/pricing.routes.ts)): Express endpoints (`POST /api/pricing/quote`, `GET /api/pricing/config`) calculating price quotes for senders.
- `backend/src/pricing/pricing.types.ts` ([pricing.types.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/pricing/pricing.types.ts)): Types for pricing request params and calculated quote breakdowns.

### Routes & Middleware (`backend/src/routes/` & `backend/src/middleware/`)
- `backend/src/routes/index.ts` ([backend/src/routes/index.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/routes/index.ts)): Main router aggregating all sub-routers.
- `backend/src/routes/health.routes.ts` ([health.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/routes/health.routes.ts)): Health check endpoint returning uptime and server status.
- `backend/src/routes/dbTest.routes.ts` ([dbTest.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/routes/dbTest.routes.ts)): Diagnostic route testing PostgreSQL pool connectivity and query latency.
- `backend/src/routes/user.routes.ts` ([user.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/routes/user.routes.ts)): User management endpoints (profile retrieval, mode toggle, KYC status).
- `backend/src/routes/delivery.routes.ts` ([delivery.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/routes/delivery.routes.ts)): Delivery lifecycle endpoints (OTP verification, status transitions).
- `backend/src/routes/matchRequest.routes.ts` ([matchRequest.routes.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/routes/matchRequest.routes.ts)): Sender-to-traveler match requests, capacity checks, and approval/rejection logic.
- `backend/src/middleware/index.ts` ([backend/src/middleware/index.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend/src/middleware/index.ts)): Central error handler capturing exceptions and returning sanitized JSON responses.
- `backend/src/controllers/index.ts`, `backend/src/repositories/index.ts`, `backend/src/services/index.ts`, `backend/src/types/index.ts`, `backend/src/utils/index.ts`, `backend/src/validators/index.ts`: Modular architectural barrels reserved for domain-driven extension.

---

## 3. NestJS Backend (`backend_nestjs/`)

A structured NestJS implementation providing modular enterprise services.

- `backend_nestjs/package.json` ([backend_nestjs/package.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend_nestjs/package.json)): NestJS scripts (`start:dev`, `build`, `test`, `lint`) and NestJS dependencies.
- `backend_nestjs/nest-cli.json` ([nest-cli.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend_nestjs/nest-cli.json)): Nest CLI build settings.
- `backend_nestjs/src/main.ts` ([backend_nestjs/src/main.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend_nestjs/src/main.ts)): NestJS bootstrapping file enabling validation pipes and CORS on port 4001.
- `backend_nestjs/src/app.module.ts` ([app.module.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/backend_nestjs/src/app.module.ts)): Root Nest module importing ConfigModule, HealthModule, and DbTestModule.
- `backend_nestjs/src/health/health.module.ts` & `health.controller.ts`: Liveness and readiness endpoints.
- `backend_nestjs/src/db-test/db-test.module.ts`, `db-test.service.ts`, `db-test.controller.ts`: TypeORM and raw PostgreSQL connection verification.
- `backend_nestjs/test/`: Jest E2E test configuration and test suites.

---

## 4. Database Migrations & Schemas (`database/`)

Relational database migrations executed sequentially against PostgreSQL.

- `database/README.md` ([database/README.md](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/README.md)): Database architectural overview and schema guidelines.
- `database/schema.sql` ([database/schema.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/schema.sql)): Complete DDL schema creating all tables.
- `database/migrations/001_create_delivery_locations.sql` ([001_create_delivery_locations.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/migrations/001_create_delivery_locations.sql)): High-throughput GPS coordinates table for real-time tracking with spatial timestamps.
- `database/migrations/001_create_users.sql` ([001_create_users.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/migrations/001_create_users.sql)): User entity table with dual-mode flags (`sender` / `traveler`), KYC statuses, and ratings.
- `database/migrations/002_create_auth_sessions.sql` ([002_create_auth_sessions.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/migrations/002_create_auth_sessions.sql)): Refresh tokens, device fingerprints, and session validity.
- `database/migrations/003_create_phone_otps.sql` ([003_create_phone_otps.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/migrations/003_create_phone_otps.sql)): Secure OTP verification table storing hashed codes, expiration timestamps, and retry counts.
- `database/migrations/004_create_match_requests.sql` ([004_create_match_requests.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/migrations/004_create_match_requests.sql)): Sender-to-traveler match requests with status state machine (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`).
- `database/migrations/005_add_pricing_quote_to_match_requests.sql` ([005_add_pricing_quote_to_match_requests.sql](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/database/migrations/005_add_pricing_quote_to_match_requests.sql)): Adds trip capacity tracking, detour distance, platform fees, traveler payout, and pricing snapshot JSONB column.

---

## 5. Next.js Frontend (`frontend/`)

A modern mobile-first full-stack application built with Next.js 14 App Router.

### Configuration & Tooling
- `frontend/package.json` ([frontend/package.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/package.json)): Frontend dependencies (`next`, `react`, `@googlemaps/js-api-loader`, `@google/generative-ai`, `socket.io-client`, `lucide-react`, `tailwindcss`).
- `frontend/next.config.js` ([next.config.js](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/next.config.js)): Next.js compilation settings and remote image domain rules.
- `frontend/tailwind.config.js` ([tailwind.config.js](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/tailwind.config.js)): Design token colors (`#002b5c`, `#0052cc`, `#00875a`, etc.), typography, and animation keyframes.
- `frontend/postcss.config.js` ([postcss.config.js](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/postcss.config.js)): PostCSS processor for Tailwind CSS and Autoprefixer.
- `frontend/tsconfig.json` ([frontend/tsconfig.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/tsconfig.json)): TypeScript path mapping (`@/*` pointing to `./*`).
- `frontend/public/favicon.ico`: Application favicon icon.

### Types & Data Modeling (`frontend/types/`)
- `frontend/types/index.ts` ([frontend/types/index.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/types/index.ts)): Core TypeScript interfaces for the entire UI: `User`, `Trip`, `Parcel`, `MatchRequest`, `Delivery`, `Payment`, `WalletTransaction`, `Review`, `Dispute`, `KYCVerification`, and enum unions.

### Client Services & State (`frontend/services/`)
- `frontend/services/apiServices.ts` ([apiServices.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/services/apiServices.ts)): Modular service abstraction (`authService`, `tripService`, `matchingService`, `deliveryService`, `walletService`, `adminService`) with seamless fallback between PostgreSQL API and reactive client store.
- `frontend/services/store.ts` ([store.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/services/store.ts)): Synchronized localStorage state layer enabling standalone offline demo capability without external DB setup.
- `frontend/services/trackingSocket.ts` ([trackingSocket.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/services/trackingSocket.ts)): Socket.IO client managing connection to backend port 4000, room subscriptions, and live GPS streaming.

### Custom React Hooks (`frontend/hooks/`)
- `frontend/hooks/useLiveLocation.ts` ([useLiveLocation.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/hooks/useLiveLocation.ts)): Browser Geolocation API listener streaming coordinates, speed, heading, and accuracy directly to Socket.IO.

### Core Libraries & Engines (`frontend/lib/`)
- `frontend/lib/constants.ts` ([constants.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/lib/constants.ts)): Predefined Indian city corridors, parcel categories, and vehicle options.
- `frontend/lib/db.ts` ([frontend/lib/db.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/lib/db.ts)): PostgreSQL client utility for Next.js server routes.
- `frontend/lib/matching/engine.ts` ([engine.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/lib/matching/engine.ts)): Multi-factor match scoring engine weighing route corridor (40%), travel date (20%), capacity (15%), departure timing (10%), ratings (10%), and KYC (5%).
- `frontend/lib/state-machine/delivery.ts` ([delivery.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/lib/state-machine/delivery.ts)): Strict finite state machine enforcing legal status transitions (`BOOKED` → `MATCHED` → `ACCEPTED` → `PICKUP_PENDING` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERY_PENDING` → `DELIVERED`).

### UI & Layout Components (`frontend/components/`)
- `frontend/components/layout/Header.tsx` ([Header.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/layout/Header.tsx)): Mobile-responsive navigation header with location picker, notification counter, and profile avatar.
- `frontend/components/layout/BottomNav.tsx` ([BottomNav.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/layout/BottomNav.tsx)): Persistent bottom bar switching between Home, Send, Trips, Deliveries, and Profile.
- `frontend/components/tracking/MapComponent.tsx` ([MapComponent.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/tracking/MapComponent.tsx)): Hybrid Google Maps component using `@googlemaps/js-api-loader` with dark logistics styling, route polylines, live moving markers, and SVG canvas offline fallback.
- `frontend/components/tracking/OTPModal.tsx` ([OTPModal.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/tracking/OTPModal.tsx)): Modal dialog for entering the 6-digit Pickup and Delivery OTPs with validation feedback.
- `frontend/components/ui/AIChatBot.tsx` ([AIChatBot.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/ui/AIChatBot.tsx)): Floating AI assistant providing live answers about insurance, prohibited cargo, transit milestones, and rates.
- `frontend/components/ui/DemoUserSwitcher.tsx` ([DemoUserSwitcher.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/ui/DemoUserSwitcher.tsx)): Developer switcher tool for toggling instantly between Sender, Traveler, and Business personas.
- `frontend/components/ui/LocationPickerModal.tsx` ([LocationPickerModal.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/ui/LocationPickerModal.tsx)): Indian city and highway hub search selector with Google Places Autocomplete.
- `frontend/components/ui/PaymentModal.tsx` ([PaymentModal.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/components/ui/PaymentModal.tsx)): Simulated Razorpay payment drawer locking sender funds into escrow until delivery OTP verification.

### App Pages & Routes (`frontend/app/`)
- `frontend/app/layout.tsx` ([layout.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/layout.tsx)): Global HTML shell with fonts, meta viewport, toast container, and global navigation wrappers.
- `frontend/app/globals.css` ([globals.css](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/globals.css)): Global CSS reset, Tailwind directives, custom scrollbars, and pulse animations.
- `frontend/app/page.tsx` ([page.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/page.tsx)): Platform Homepage displaying quick actions (Send Parcel, Post a Trip), active deliveries summary, corridor explorer, and safety guarantees.
- `frontend/app/error.tsx` & `global-error.tsx`: User-facing boundary catching unexpected runtime exceptions with recovery actions.
- `frontend/app/login/page.tsx` ([frontend/app/login/page.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/login/page.tsx)): Authentication page supporting phone number input, MSG91 SMS OTP verification, and password login.
- `frontend/app/signup/page.tsx`: Redirects new users to the login flow with automatic registration on verified phone numbers.
- `frontend/app/send/page.tsx` ([frontend/app/send/page.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/send/page.tsx)): Step 1 of sender workflow (origin, destination, date, and handoff preference).
- `frontend/app/send/parcel-details/page.tsx`: Step 2 of sender workflow (parcel category, weight, dimensions, declared value, insurance opt-in, prohibited cargo check).
- `frontend/app/send/travelers/page.tsx`: Step 3 of sender workflow (browsing ranked traveler matches scored by the matching engine).
- `frontend/app/send/booking-summary/page.tsx`: Step 4 of sender workflow (itemized price breakdown, escrow lock, and booking confirmation).
- `frontend/app/traveler/page.tsx` ([frontend/app/traveler/page.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/traveler/page.tsx)): Traveler mode screen to post an upcoming trip (origin, destination, date, vehicle type, available capacity, rate per kg).
- `frontend/app/traveler/requests/page.tsx`: Traveler inbox to review, accept, or decline incoming parcel match requests.
- `frontend/app/trips/page.tsx`: Traveler trips dashboard listing posted, active, and completed journeys.
- `frontend/app/trips/[id]/page.tsx`: Traveler trip command center to update milestones (*Started*, *Arrived at Pickup*, *In Transit*, *Delivered*) and verify sender Pickup OTP.
- `frontend/app/deliveries/page.tsx`: Sender and traveler list of all current and historical parcel shipments.
- `frontend/app/deliveries/[id]/page.tsx` ([frontend/app/deliveries/[id]/page.tsx](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/deliveries/[id]/page.tsx)): Real-time delivery tracking dashboard featuring live GPS map, OTP display, milestone timeline, and traveler contact card.
- `frontend/app/chat/[deliveryId]/page.tsx`: End-to-end communication chat between sender and traveler during an active dispatch.
- `frontend/app/wallet/page.tsx`: Financial wallet displaying available balance, escrow holds, payout history, and bank withdrawal modal.
- `frontend/app/profile/page.tsx`: User profile management, role toggling, delivery statistics, and vehicle info.
- `frontend/app/profile/kyc/page.tsx`: Identity verification portal for uploading government ID (Aadhaar / Passport) and selfie.
- `frontend/app/safety/page.tsx`: Safety Center explaining insurance policies, identity verification, and prohibited cargo rules.
- `frontend/app/safety/dispute/page.tsx`: Customer dispute filing form for reporting delivery delays, damaged parcels, or lost shipments.
- `frontend/app/business/page.tsx`: B2B Corporate logistics portal for batch shipments, bulk dispatching, and invoicing.
- `frontend/app/admin/page.tsx`: Administrative control center displaying platform analytics, active deliveries, and revenue.
- `frontend/app/admin/kyc/page.tsx`: Admin review queue for approving or rejecting submitted KYC identities.
- `frontend/app/admin/disputes/page.tsx`: Admin arbitration center for resolving disputed escrows and authorizing payouts/refunds.
- `frontend/app/debug/maps/page.tsx`: Developer diagnostic tool testing Google Maps JS API keys, place autocompletes, and directions rendering.
- `frontend/app/debug/tracking/page.tsx`: Developer tool simulating traveler movement along a road corridor and validating Socket.IO emission rates.
- `frontend/app/api/ai-chat/route.ts` ([ai-chat/route.ts](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/frontend/app/api/ai-chat/route.ts)): Next.js API route integrating Google Gemini (`gemini-1.5-flash`) for dynamic customer support answers.
- `frontend/app/api/config/route.ts`: Exposes public client runtime configurations (e.g. Google Maps API keys).
- `frontend/app/api/db-test/route.ts`: Quick HTTP ping testing PostgreSQL connectivity from Next.js server side.

### Stitch UI Mockup Library (`frontend/stitch_rideel_peer_to_peer_express_logistics/`)
Contains 47 complete screen designs generated from Google Stitch, each containing `code.html` and `screen.png`:
- `active_trip/`, `admin_dashboard_desktop/`, `admin_delivery_management/`, `admin_disputes/`, `admin_kyc_review/`, `admin_payments/`, `admin_reports_analytics/`, `admin_users/`
- `available_travelers/`, `booking_confirmed/`, `booking_summary/`, `business_bulk_shipment/`, `business_dashboard_b2b/`, `business_shipment_history/`
- `chat/`, `chat_traveler_sender/`, `delivery_completed/`, `delivery_details/`, `delivery_verification/`, `earnings_dashboard/`
- `insurance_details/`, `kyc_verification/`, `live_tracking/`, `login_sign_up/`, `notifications_center/`, `onboarding_flow/`
- `parcel_details/`, `payment_escrow/`, `personal_information/`, `pickup_verification/`, `profile_menu/`, `profile_setup/`
- `rating_review/`, `report_issue/`, `safety_center/`, `send_parcel_route/`, `splash_screen/`, `transaction_details/`
- `traveler_delivery_handoff/`, `traveler_delivery_otp/`, `traveler_details/`, `traveler_parcel_requests/`, `trips_dashboard/`, `vehicle_verification/`, `wallet/`, `withdraw_money/`
- `rideel_core/DESIGN.md`: Design documentation establishing the visual language, typography, color palette, and component specifications.

---

## 6. Nemo Companion Application (`Nemo/`)

A standalone AI visual educator project residing within the workspace:
- `Nemo/package.json` ([Nemo/package.json](file:///c:/Users/aashi/OneDrive/Desktop/Rideel/Nemo/package.json)): Vite + React 19 app utilizing `@langchain/core`, `@langchain/langgraph`, and `zod`.
- `Nemo/ARCHITECTURE.md`: Technical documentation explaining the infinite black canvas visual drawing engine.
- `Nemo/src/`: Canvas UI and teacher rendering components.
- `Nemo/server/`: Standalone Node server for script generation.
- `Nemo/manim/`: Mathematical animation scripts.
- `Nemo/tests/`: Automated unit and browser verification tests.

---

## 7. Subfolder Artifact (`Rideel/`)

- `Rideel/.git` & `.gitattributes`: Nested repository artifact from a previous clone or submodule reference.
