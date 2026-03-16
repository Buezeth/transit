// CHANGELOG.md
## [0.5.0] - Sprint 6: Bilingual i18n Support (English & French) - 2026-03-16

### Added
- **Zero-Dependency i18n Engine:** Implemented a lightweight, native Next.js localization architecture using dynamic route segments (`app/[lang]`).
- **Edge Middleware:** Added `middleware.ts` to automatically detect a user's language preference and rewrite standard URLs (e.g., `/dashboard`) to localized paths (e.g., `/fr/dashboard` or `/en/dashboard`).
- **Server-Side Dictionaries:** Created `dictionaries/en.json` and `dictionaries/fr.json` to store all application text. Added `lib/dictionaries.ts` to asynchronously load these on the server, ensuring zero impact on the client-side bundle size.
- **Language Switcher:** Added a client-side `<LanguageSwitcher />` component that allows users to manually toggle between English and French. It sets a `NEXT_LOCALE` cookie to remember their preference.

### Changed
- **Folder Structure:** Migrated all route groups (`(admin)` and `(public)`) into a new dynamic `app/[lang]/` folder hierarchy.
- **Dynamic Routing:** Refactored all Next.js `<Link>` components across the application to accept and prepend the dynamic `${lang}` segment to their `href` paths.
- **UI Components:** Extracted all hardcoded English text from Server and Client components. Server components now await `getDictionary(lang)`, and Client components (like `PackageForm`, `ManifestManager`, and `TariffRow`) now accept translated strings via a `dict` prop.
- **Cache Invalidation:** Updated all Server Actions (`createPackage`, `createShipment`, `updateTariffPrice`, etc.) to use global layout revalidation (`revalidatePath('/', 'layout')`) so that updates clear the cache for both English and French routes simultaneously.

### Fixed
- **Global CSS Pathing:** Corrected the relative import path for `globals.css` in the root layout after moving it down into the `[lang]` directory.
## [0.4.0] - Sprint 5: MVP Polish - 2026-03-08
### Added
- **Dashboard Metrics:** Added dynamic Prisma aggregations to display real-time counts for "Packages in Transit", "Active Shipments", and "Pending Deliveries" in `app/(admin)/dashboard/page.tsx`.
- **Tariff Management:** Implemented inline editing for pricing tariffs. Admins can now update `unitPrice` and toggle `isActive` statuses directly from the settings table via `app/(admin)/dashboard/settings/components/tariff-row.tsx`.
- **Settings Server Actions:** Added `updateTariffPrice` in `app/actions/settings.actions.ts` to handle tariff mutations.

### Changed
- **Tracking ID Generation:** Migrated tracking ID generation from the frontend (`PackageForm`) to a collision-proof, loop-validated server-side implementation (`generateUniqueTrackingId`) in `app/actions/package.actions.ts`.

### Fixed
- Hardcoded zero values on the admin dashboard overview.

## [0.3.0] - Sprint 4: Public Tracking & Delivery - 2026-03-07
### Added
- **Public Landing Page:** Replaced the default Next.js template with a clean, search-focused landing page where users can enter their Tracking ID.
- **Tracking Results Page:** Implemented a detailed public view (`/track/[id]`) featuring:
  - **Visual Progress Stepper:** Displays the 5-stage journey (Received → Delivered).
  - **Financial Summary:** clearly highlights the "Amount Due" and Payment Status (Pending vs. Paid).
  - **Shipment Context:** Shows the parent container/flight reference if assigned.
- **Delivery Workflow:** Added a "Mark as Delivered & Paid" quick-action button in the Admin Packages list to finalize the transaction lifecycle.
- **404 Handling:** Added a user-friendly "Tracking ID Not Found" state with a quick return link.

### Changed
- **Package List UI:** Updated the Admin Packages table to include action buttons in the status column, allowing for one-click status resolution.

## [0.2.0] - Sprint 2 & 3: Intake & Logistics - 2026-03-07
### Added
- **Package Intake System:** Built the "New Package" form with real-time price estimation based on the active tariff schedule.
- **Customer Lookup:** Integrated automatic customer detection by phone number during package entry; creates new customer records on the fly.
- **Shipment Management:** Added the ability to create "Air" or "Sea" manifests (Shipments) with auto-generated reference IDs (e.g., `AIR-2603-X9Y`).
- **Manifest Manager:** Created a visual interface to assign unassigned packages to specific shipments and remove them if needed.
- **Status Cascading:** Implemented logic where updating a Shipment's status (e.g., to `IN_TRANSIT`) automatically updates the status of all contained packages via a database transaction.
- **Admin UI:** Added list views for Packages and Shipments with filtering and summary statistics.

### Fixed
- **Database Connection Pooling:** Modified `lib/prisma.ts` to cache the PostgreSQL connection pool (`pg.Pool`) alongside the Prisma Client. This prevents connection exhaustion errors ("Unable to start a transaction") during Next.js Hot Module Replacement (HMR).

## [0.1.0] - Sprint 1 Foundation - 2026-03-07
### Added
- **Database Connection:** Integrated `@prisma/adapter-pg` and `pg` to connect Next.js securely to a Supabase PostgreSQL database using Prisma 7.
- **Dynamic Pricing Model:** Replaced hardcoded pricing with a dynamic `Tariff` table in the database to support varying shipping costs (Air vs. Sea, Normal vs. Battery, Cartons, etc.).
- **Database Seeding:** Created `prisma/seed.ts` to automatically populate the database with the official July 2025 Cameroon Logistics pricing model.
- **Prisma 7 Configuration:** Added `prisma.config.ts` to comply with the new Prisma 7 architectural standards for driver adapters and seeding.