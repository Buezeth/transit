// app/[lang]/(admin)/dashboard/packages/new/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PackageForm } from "../components/package-form";
import { getDictionary } from "@/lib/dictionaries";

export default async function NewPackagePage({ params }: { params: Promise<{ lang: 'en'|'fr' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/${lang}/dashboard/packages`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{dict.packageForm.title}</h1>
      </div>
      <PackageForm dict={dict.packageForm} />
    </div>
  );
}