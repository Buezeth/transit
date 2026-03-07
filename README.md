# README.md
# 📦 Transitor Logistics Dashboard

A custom-built Next.js application designed for transitors managing cross-border e-commerce (Air and Sea freight) into Cameroon. 

This system tracks individual customer packages, consolidates them into bulk shipments, calculates dynamic pricing based on specific transport methods (e.g., CBM for Sea, KG for Air), and provides a public tracking portal for end-customers.

## 🏗️ Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Prisma 7 (with `@prisma/adapter-pg`)
- **Styling:** Tailwind CSS v4

## 🚀 Getting Started

### 1. Environment Variables
Create a `.env` file in the root directory and add your Supabase connection string:
\`\`\`env
DATABASE_URL="postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Database Setup (Prisma 7)
Because we use Prisma 7, our database connections require generating local types and pushing the schema to Supabase.
\`\`\`bash
# 1. Generate local TypeScript types
npx prisma generate

# 2. Push the schema to the database (creates the tables)
npx prisma db push

# 3. Seed the database with the Cameroon July 2025 pricing tariffs
npx prisma db seed
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 💼 Business Logic (Pricing)
Pricing is not hardcoded. It is calculated dynamically based on the `Tariff` table in the database. 
- **Air Freight:** Calculated per KG (varies for Normal vs. Battery/Liquid/Powder).
- **Sea Freight:** Calculated per CBM, or via flat rates for Cartons and Big Bales.
- **Overrides:** "Chemicals" and large bulk orders trigger a manual management override flag.

## 📂 Project Structure
- `app/(admin)/*` - Protected dashboard for the Transitor to manage logistics.
- `app/(public)/*` - Unprotected routes (like the public tracking page for buyers).
- `app/actions/*` - Next.js Server Actions for database mutations.
- `prisma/schema.prisma` - The database blueprint.