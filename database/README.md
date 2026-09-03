# RIDEEL Database Layer

This directory contains database migrations, seed data, and schema definitions for the RIDEEL peer-to-peer express logistics platform.

> **Note**: The existing PostgreSQL database is the single source of truth. Schema files in this directory serve as reference documentation and migration blueprints.

## Structure
- `migrations/`: SQL migration files ordered sequentially (`001_create_users.sql`, `002_create_drivers.sql`, etc.)
- `seeds/`: Development seed data for local testing.
- `schema.sql`: Complete DDL schema reference for PostgreSQL tables.

## PostgreSQL Tables
- `users`: Core member accounts (senders, travelers, business, admin).
- `drivers`: Verified driver profiles and ratings.
- `vehicles`: Capacity and vehicle details linked to drivers.
- `rides`: Posted intercity trips with origin, destination, and available weight capacity.
- `bookings`: Parcel delivery bookings between senders and travelers/drivers.
- `payments`: Escrow ledger and transaction tracking.
- `reviews`: Peer-to-peer ratings and comments.
- `notifications`: Real-time and in-app user notifications.
- `password_reset_tokens`: Security token management.
