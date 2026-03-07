// app/actions/shipment.actions.ts
'use server';

import { prisma } from "@/lib/prisma";
import { ShippingMethod, TransitStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Creates a new empty Shipment (Manifest).
 * Generates a readable reference ID (e.g., AIR-2603-X9Y).
 */
export async function createShipment(formData: FormData) {
  const method = formData.get('method') as ShippingMethod;
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', ''); // 2603 (YearMonth)
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const reference = `${method}-${dateStr}-${randomSuffix}`;

  await prisma.shipment.create({
    data: {
      reference,
      method,
      status: TransitStatus.WAREHOUSE_RECEIVED,
    }
  });

  revalidatePath('/dashboard/shipments');
}

/**
 * Updates the shipment status AND cascades it to all contained packages.
 */
export async function updateShipmentStatus(shipmentId: string, newStatus: TransitStatus) {
  // Transaction ensures both update or neither does
  await prisma.$transaction([
    // 1. Update Shipment
    prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: newStatus }
    }),
    // 2. Cascade to Packages
    prisma.package.updateMany({
      where: { shipmentId },
      data: { status: newStatus }
    })
  ]);

  revalidatePath(`/dashboard/shipments/${shipmentId}`);
}

/**
 * Assigns a package to a shipment.
 */
export async function assignPackageToShipment(shipmentId: string, packageId: string) {
  await prisma.package.update({
    where: { id: packageId },
    data: { shipmentId }
  });
  revalidatePath(`/dashboard/shipments/${shipmentId}`);
}

/**
 * Removes a package from a shipment (returns to pool).
 */
export async function removePackageFromShipment(packageId: string, shipmentId: string) { // shipmentId needed for revalidation
  await prisma.package.update({
    where: { id: packageId },
    data: { shipmentId: null }
  });
  revalidatePath(`/dashboard/shipments/${shipmentId}`);
}