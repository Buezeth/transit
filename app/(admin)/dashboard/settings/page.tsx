// app/(admin)/dashboard/settings/page.tsx
import { prisma } from "@/lib/prisma";

// Forces Next.js to always fetch fresh data from Supabase
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Fetch the tariffs we just seeded!
  const tariffs = await prisma.tariff.findMany({
    orderBy:[
      { method: 'asc' },
      { category: 'asc' }
    ]
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pricing Tariffs (July 2025)</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th className="px-6 py-4 font-medium">Transport</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price (FCFA)</th>
              <th className="px-6 py-4 font-medium">Unit</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tariffs.map((tariff) => (
              <tr key={tariff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{tariff.method}</td>
                <td className="px-6 py-4">{tariff.category.replace(/_/g, ' ')}</td>
                <td className="px-6 py-4 font-mono font-medium">
                  {tariff.unitPrice === 0 
                    ? <span className="text-orange-600">Consult Direction</span>
                    : `${tariff.unitPrice.toLocaleString('fr-CM')} FCFA`}
                </td>
                <td className="px-6 py-4">
                  {tariff.unitType} {tariff.isFlatRate && <span className="text-xs text-gray-400 ml-1">(Flat)</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tariff.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tariff.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}