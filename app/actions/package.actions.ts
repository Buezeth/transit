// // app/actions/package.actions.ts
import { prisma } from "@/lib/prisma";
import { PackageCategory } from "@prisma/client";

/**
 * Dynamically calculates the base price using live database tariffs.
 */
export async function calculateBasePrice(
  category: PackageCategory, 
  measurement: number = 1 // Can be weight (KG), volume (CBM), or quantity (1)
) {
  // 1. Fetch the active tariff from the database
  const tariff = await prisma.tariff.findUnique({
    where: { category }
  });

  // 2. Handle missing or "Consult Direction" categories (e.g., Chemicals)
  if (!tariff) {
    return { 
      price: 0, 
      requiresOverride: true, 
      message: "No tariff found. Consult direction for pricing." 
    };
  }

  // 3. Calculate based on tariff rules
  const finalPrice = tariff.isFlatRate 
    ? tariff.unitPrice 
    : tariff.unitPrice * measurement;

  return {
    price: finalPrice,
    appliedRate: tariff.unitPrice,
    requiresOverride: false,
    message: "Success"
  };
}