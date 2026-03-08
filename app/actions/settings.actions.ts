// app/actions/settings.actions.ts
'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTariffPrice(id: string, unitPrice: number, isActive: boolean) {
  await prisma.tariff.update({
    where: { id },
    data: { 
      unitPrice,
      isActive 
    }
  });

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard/packages/new'); // Ensure new packages use fresh pricing
}