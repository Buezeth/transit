// app/(admin)/dashboard/settings/page.tsx
import { prisma } from "@/lib/prisma";
import { TariffRow } from "./components/tariff-row";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const tariffs = await prisma.tariff.findMany({
    orderBy:[
      { method: 'asc' },
      { category: 'asc' }
    ]
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pricing Tariffs</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th className="px-6 py-4 font-medium">Transport</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price (FCFA)</th>
              <th className="px-6 py-4 font-medium">Unit</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tariffs.map((tariff) => (
              <TariffRow key={tariff.id} tariff={tariff} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}