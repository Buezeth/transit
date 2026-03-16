// app/[lang]/(admin)/dashboard/settings/page.tsx
import { prisma } from "@/lib/prisma";
import { TariffRow } from "./components/tariff-row";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ lang: 'en'|'fr' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const tariffs = await prisma.tariff.findMany({
    orderBy: [ { method: 'asc' }, { category: 'asc' } ]
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{dict.settings.title}</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th className="px-6 py-4 font-medium">{dict.settings.table.transport}</th>
              <th className="px-6 py-4 font-medium">{dict.settings.table.category}</th>
              <th className="px-6 py-4 font-medium">{dict.settings.table.price}</th>
              <th className="px-6 py-4 font-medium">{dict.settings.table.unit}</th>
              <th className="px-6 py-4 font-medium">{dict.settings.table.status}</th>
              <th className="px-6 py-4 font-medium text-right">{dict.settings.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tariffs.map((tariff) => (
              <TariffRow key={tariff.id} tariff={tariff} dict={dict.settings} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}