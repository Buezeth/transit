// app/(admin)/dashboard/shipments/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Ship, Plane, ArrowRight } from "lucide-react";
import { createShipment } from "@/app/actions/shipment.actions";

export const dynamic = "force-dynamic";

export default async function ShipmentsPage() {
  const shipments = await prisma.shipment.findMany({
    include: {
      _count: {
        select: { packages: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        
        <div className="flex gap-2">
          {/* Quick Create Buttons */}
          <form action={createShipment}>
            <input type="hidden" name="method" value="AIR" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> New Air Shipment
            </button>
          </form>
          <form action={createShipment}>
            <input type="hidden" name="method" value="SEA" />
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> New Sea Shipment
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map((shipment) => (
          <Link 
            key={shipment.id} 
            href={`/dashboard/shipments/${shipment.id}`}
            className="block group"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${shipment.method === 'AIR' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}>
                    {shipment.method === 'AIR' ? <Plane className="w-5 h-5" /> : <Ship className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{shipment.reference}</h3>
                    <p className="text-xs text-gray-500">Created {shipment.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600`}>
                  {shipment.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-gray-500">
                  {shipment._count.packages} Packages
                </span>
                <span className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  Manage <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
        
        {shipments.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p>No active shipments. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}