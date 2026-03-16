// app/[lang]/(admin)/layout.tsx
import Link from "next/link";
import { Package, Ship, Settings, LayoutDashboard } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

export default async function AdminLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ lang: 'en'|'fr' }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600 tracking-tight">Transitor MVP</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <LayoutDashboard className="w-5 h-5" /> {dict.sidebar.dashboard}
          </Link>
          <Link href={`/${lang}/dashboard/packages`} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <Package className="w-5 h-5" /> {dict.sidebar.packages}
          </Link>
          <Link href={`/${lang}/dashboard/shipments`} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <Ship className="w-5 h-5" /> {dict.sidebar.shipments}
          </Link>
          <Link href={`/${lang}/dashboard/settings`} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <Settings className="w-5 h-5" /> {dict.sidebar.settings}
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}