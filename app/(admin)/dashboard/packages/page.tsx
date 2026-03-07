// app/(admin)/dashboard/packages/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Package as PackageIcon, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    include: {
      customer: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
        <Link 
          href="/dashboard/packages/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Receive Package
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th className="px-6 py-4 font-medium">Tracking ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <PackageIcon className="w-8 h-8 opacity-20" />
                    <p>No packages found. Receive your first one.</p>
                  </div>
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">
                    {pkg.trackingId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{pkg.customer.name}</div>
                    <div className="text-xs text-gray-400">{pkg.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">{pkg.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {pkg.category.replace(/_/g, ' ')}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {pkg.weight ? `${pkg.weight} KG` : `${pkg.volumeCBM} CBM`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {pkg.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {(pkg.priceXAF || 0).toLocaleString('fr-CM')} FCFA
                    {pkg.isDiscounted && <span className="text-orange-500 ml-1 text-xs">*</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}