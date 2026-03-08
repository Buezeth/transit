// app/actions/package.actions.ts
'use server';

import { prisma } from "@/lib/prisma";
import { PackageCategory, ShippingMethod, TransitStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function getCustomerByPhone(phone: string) {
  return await prisma.customer.findUnique({
    where: { phone }
  });
}

// AC-5.3: Loop until unique ID is found
async function generateUniqueTrackingId(): Promise<string> {
  let isUnique = false;
  let newTrackingId = '';
  
  while (!isUnique) {
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    newTrackingId = `TRK-${dateStr}-${randomSuffix}`;
    
    const existing = await prisma.package.findUnique({
      where: { trackingId: newTrackingId },
      select: { id: true }
    });
    
    if (!existing) {
      isUnique = true;
    }
  }
  
  return newTrackingId;
}

export async function createPackage(formData: FormData) {
  const phone = formData.get('phone') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as PackageCategory;
  const method = formData.get('method') as ShippingMethod;
  
  // AC-5.3: Server-side generation execution
  let trackingId = formData.get('trackingId') as string;
  if (!trackingId || trackingId.trim() === '') {
    trackingId = await generateUniqueTrackingId();
  }

  const weightRaw = formData.get('weight');
  const volumeRaw = formData.get('volumeCBM');
  const priceRaw = formData.get('priceXAF');

  const weight = weightRaw ? parseFloat(weightRaw.toString()) : null;
  const volumeCBM = volumeRaw ? parseFloat(volumeRaw.toString()) : null;
  const priceXAF = priceRaw ? parseInt(priceRaw.toString()) : 0;
  
  const { price: calculatedPrice, appliedRate } = await calculateBasePrice(
    category, 
    method === 'AIR' ? (weight || 0) : (volumeCBM || 1)
  );

  const isDiscounted = priceXAF !== calculatedPrice;

  try {
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name },
      create: { phone, name }
    });

    await prisma.package.create({
      data: {
        trackingId: trackingId.toUpperCase(),
        description,
        category,
        weight,
        volumeCBM,
        appliedRate,
        priceXAF,
        isDiscounted,
        status: TransitStatus.WAREHOUSE_RECEIVED,
        customerId: customer.id,
      }
    });

  } catch (error) {
    console.error("Failed to create package:", error);
    throw new Error("Failed to create package");
  }

  revalidatePath('/dashboard/packages');
  revalidatePath('/dashboard'); 
  redirect('/dashboard/packages');
}

export async function markPackageDelivered(packageId: string) {
  await prisma.package.update({
    where: { id: packageId },
    data: {
      status: 'DELIVERED',
      isPaid: true
    }
  });

  revalidatePath('/dashboard/packages');
  revalidatePath('/dashboard'); 
}