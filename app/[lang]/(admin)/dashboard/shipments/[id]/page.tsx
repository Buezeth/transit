// app/[lang]/(admin)/dashboard/shipments/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ManifestManager } from "./components/manifest-manager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

export default async function ShipmentDetailsPage({ params }: { params: Promise<{ id: string, lang: 'en'|'fr' }> }) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang);

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: { packages: { include: { customer: true } } }
  });

  if (!shipment) return notFound();

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
        <Link href={`/${lang}/dashboard/shipments`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{shipment.reference}</h1>
          <p className="text-sm text-gray-500">{shipment.method} {dict.shipments.freight} • {dict.shipments.created} {shipment.createdAt.toLocaleDateString()}</p>
        </div>
      </div>

      <ManifestManager 
        shipmentId={shipment.id}
        shipmentStatus={shipment.status}
        currentPackages={shipment.packages}
        availablePackages={availablePackages}
        dict={dict.shipments}
      />
    </div>
  );
}