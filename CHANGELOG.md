# CHANGELOG.md

## [0.1.0] - Sprint 1 Foundation - 2026-03-07
### Added
- **Database Connection:** Integrated `@prisma/adapter-pg` and `pg` to connect Next.js securely to a Supabase PostgreSQL database using Prisma 7.
- **Dynamic Pricing Model:** Replaced hardcoded pricing with a dynamic `Tariff` table in the database to support varying shipping costs (Air vs. Sea, Normal vs. Battery, Cartons, etc.).
- **Database Seeding:** Created `prisma/seed.ts` to automatically populate the database with the official July 2025 Cameroon Logistics pricing model.
- **Prisma 7 Configuration:** Added `prisma.config.ts` to comply with the new Prisma 7 architectural standards for driver adapters and seeding.

### Changed
- Updated `schema.prisma` to include `PackageCategory` and `ShippingMethod` enums.
- Removed `url` from `schema.prisma` datasource block in favor of environment variable injection via `prisma.config.ts`.