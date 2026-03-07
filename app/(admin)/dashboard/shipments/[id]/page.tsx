// app/(admin)/dashboard/shipments/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ManifestManager } from "./components/manifest-manager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Shipment and its current packages
  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      packages: {
        include: { customer: true }
      }
    }
  });

  if (!shipment) return notFound();

  // 2. Fetch "The Pool" (Unassigned packages matching the method)
  // Logic: Must be unassigned (shipmentId: null) AND match method (Air vs Sea)
  const availablePackages = await prisma.package.findMany({
    where: {
      shipmentId: null,
      category: shipment.method === 'AIR' 
        ? { in: ['AIR_NORMAL', 'AIR_BATTERY_LIQUID_POWDER'] }
        : { in: ['SEA_NORMAL', 'SEA_CARTON', 'SEA_BIG_BALE', 'SEA_MACHINE', 'SEA_CHEMICAL'] }
    },
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/dashboard/shipments" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{shipment.reference}</h1>
          <p className="text-sm text-gray-500">{shipment.method} Freight • Created {shipment.createdAt.toLocaleDateString()}</p>
        </div>
      </div>

      <ManifestManager 
        shipmentId={shipment.id}
        shipmentStatus={shipment.status}
        currentPackages={shipment.packages}
        availablePackages={availablePackages}
      />
    </div>
  );
}