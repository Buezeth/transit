// prisma/seed.ts
import 'dotenv/config'; // Loads your .env file
import { PrismaClient, PackageCategory, ShippingMethod } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Setup the connection pool just like we did for the main app
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Pass the adapter to PrismaClient!
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding tariffs...');

  const tariffs =[
    {
      category: PackageCategory.AIR_NORMAL,
      method: ShippingMethod.AIR,
      unitPrice: 8500,
      unitType: 'KG',
      isFlatRate: false,
    },
    {
      category: PackageCategory.AIR_BATTERY_LIQUID_POWDER,
      method: ShippingMethod.AIR,
      unitPrice: 10500, 
      unitType: 'KG',
      isFlatRate: false,
    },
    {
      category: PackageCategory.SEA_NORMAL,
      method: ShippingMethod.SEA,
      unitPrice: 350000,
      unitType: 'CBM',
      isFlatRate: false,
    },
    {
      category: PackageCategory.SEA_CARTON,
      method: ShippingMethod.SEA,
      unitPrice: 360000,
      unitType: 'UNIT',
      isFlatRate: true, 
    },
    {
      category: PackageCategory.SEA_BIG_BALE,
      method: ShippingMethod.SEA,
      unitPrice: 400000,
      unitType: 'UNIT',
      isFlatRate: true,
    },
    {
      category: PackageCategory.SEA_MACHINE,
      method: ShippingMethod.SEA,
      unitPrice: 385000, 
      unitType: 'CBM',
      isFlatRate: false,
    },
    {
      category: PackageCategory.SEA_CHEMICAL,
      method: ShippingMethod.SEA,
      unitPrice: 0, 
      unitType: 'CBM',
      isFlatRate: false,
    }
  ];

  for (const tariff of tariffs) {
    await prisma.tariff.upsert({
      where: { category: tariff.category },
      update: tariff,
      create: tariff,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    // Close the connection pool so the script exits cleanly
    await pool.end();
  });