// app/(admin)/dashboard/page.tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const[inTransitPackages, activeShipments, pendingDeliveries] = await Promise.all([
    prisma.package.count({
      where: { status: 'IN_TRANSIT' }
    }),
    prisma.shipment.count({
      where: { status: { not: 'DELIVERED' } }
    }),
    prisma.package.count({
      where: { status: 'READY_FOR_PICKUP' }
    })
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Packages in Transit</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{inTransitPackages}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Active Shipments</h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">{activeShipments}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pending Deliveries</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{pendingDeliveries}</p>
        </div>
      </div>
    </div>
  );
}