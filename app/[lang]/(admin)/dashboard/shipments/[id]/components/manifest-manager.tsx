// app/[lang]/(admin)/dashboard/shipments/[id]/components/manifest-manager.tsx
'use client';

import { TransitStatus } from "@prisma/client";
import { updateShipmentStatus, assignPackageToShipment, removePackageFromShipment } from "@/app/actions/shipment.actions";
import { PackageOpen, X, ArrowRight, CheckCircle, Anchor } from "lucide-react";
import { useTransition } from "react";

type SimplePackage = {
  id: string; trackingId: string; description: string;
  weight: number | null; volumeCBM: number | null;
  customer: { name: string };
};

interface Props {
  shipmentId: string; shipmentStatus: TransitStatus;
  currentPackages: SimplePackage[]; availablePackages: SimplePackage[]; dict: any;
}

export function ManifestManager({ shipmentId, shipmentStatus, currentPackages, availablePackages, dict }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => startTransition(() => updateShipmentStatus(shipmentId, newStatus as TransitStatus));
  const handleAssign = (pkgId: string) => startTransition(() => assignPackageToShipment(shipmentId, pkgId));
  const handleRemove = (pkgId: string) => startTransition(() => removePackageFromShipment(pkgId, shipmentId));

  const statusOptions = Object.values(TransitStatus);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{dict.status}</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status} disabled={isPending} onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                shipmentStatus === status ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">{dict.warning}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Anchor className="w-4 h-4" /> {dict.manifest} ({currentPackages.length})
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              {dict.total}: {currentPackages.reduce((acc, p) => acc + (p.weight || p.volumeCBM || 0), 0).toFixed(2)} {dict.units}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {currentPackages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <PackageOpen className="w-8 h-8 opacity-20 mb-2" />
                <p>{dict.manifestEmpty}</p>
              </div>
            ) : (
              currentPackages.map(pkg => (
                <div key={pkg.id} className="p-3 border border-gray-100 rounded bg-white hover:border-red-200 group transition-colors flex justify-between items-center">
                  <div>
                    <div className="font-mono text-xs text-blue-600 font-bold">{pkg.trackingId}</div>
                    <div className="text-sm text-gray-900">{pkg.description}</div>
                    <div className="text-xs text-gray-500">{pkg.customer.name} • {pkg.weight ? `${pkg.weight}kg` : `${pkg.volumeCBM}cbm`}</div>
                  </div>
                  <button onClick={() => handleRemove(pkg.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <PackageOpen className="w-4 h-4" /> {dict.unassigned}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {availablePackages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <CheckCircle className="w-8 h-8 opacity-20 mb-2" />
                <p>{dict.unassignedEmpty}</p>
              </div>
            ) : (
              availablePackages.map(pkg => (
                <div key={pkg.id} className="p-3 border border-gray-100 rounded bg-white hover:border-green-200 group transition-colors flex justify-between items-center">
                  <div>
                    <div className="font-mono text-xs text-gray-500">{pkg.trackingId}</div>
                    <div className="text-sm text-gray-900">{pkg.description}</div>
                    <div className="text-xs text-gray-500">{pkg.customer.name}</div>
                  </div>
                  <button onClick={() => handleAssign(pkg.id)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"><ArrowRight className="w-4 h-4" /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}