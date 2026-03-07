// app/actions/package.actions.ts
'use server';

import { prisma } from "@/lib/prisma";
import { PackageCategory, ShippingMethod, TransitStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Calculates price based on category and measurement.
 * Used by the frontend for real-time preview.
 */
export async function calculateBasePrice(
  category: PackageCategory, 
  measurement: number = 1
) {
  if (!category) return { price: 0, appliedRate: 0, message: "Select a category" };

  const tariff = await prisma.tariff.findUnique({
    where: { category }
  });

  if (!tariff) {
    return { 
      price: 0, 
      appliedRate: 0,
      requiresOverride: true, 
      message: "No tariff found. Consult direction." 
    };
  }

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

/**
 * Looks up a customer by phone number.
 */
export async function getCustomerByPhone(phone: string) {
  return await prisma.customer.findUnique({
    where: { phone }
  });
}

/**
 * Main Action: Creates a customer (if needed) and the package.
 */
export async function createPackage(formData: FormData) {
  const phone = formData.get('phone') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const trackingId = formData.get('trackingId') as string;
  const category = formData.get('category') as PackageCategory;
  const method = formData.get('method') as ShippingMethod;
  
  // Numeric parsing
  const weightRaw = formData.get('weight');
  const volumeRaw = formData.get('volumeCBM');
  const priceRaw = formData.get('priceXAF');

  const weight = weightRaw ? parseFloat(weightRaw.toString()) : null;
  const volumeCBM = volumeRaw ? parseFloat(volumeRaw.toString()) : null;
  const priceXAF = priceRaw ? parseInt(priceRaw.toString()) : 0;
  
  // Check override/discount status
  // We need to fetch the base rate again to determine if 'isDiscounted' should be true
  // (i.e. if the user manually changed the price from the calculation)
  const { price: calculatedPrice, appliedRate } = await calculateBasePrice(
    category, 
    method === 'AIR' ? (weight || 0) : (volumeCBM || 1)
  );

  const isDiscounted = priceXAF !== calculatedPrice;

  try {
    // 1. Find or Create Customer
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name }, // Update name if they changed it
      create: { phone, name }
    });

    // 2. Create Package
    await prisma.package.create({
      data: {
        trackingId,
        description,
        category,
        weight,
        volumeCBM,
        appliedRate,
        priceXAF,
        isDiscounted,
        status: TransitStatus.WAREHOUSE_RECEIVED,
        customerId: customer.id,
        // Optional: Manual shipment assignment could happen here, but we'll leave it null for now
      }
    });

  } catch (error) {
    console.error("Failed to create package:", error);
    throw new Error("Failed to create package");
  }

  revalidatePath('/dashboard/packages');
  revalidatePath('/dashboard'); // Update dashboard counters
  redirect('/dashboard/packages');
}