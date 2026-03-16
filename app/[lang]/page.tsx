// app/[lang]/page.tsx
import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { LanguageSwitcher } from "@/app/components/language-switcher";

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'fr' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  async function trackPackage(formData: FormData) {
    'use server';
    const trackingId = formData.get('trackingId') as string;
    if (trackingId) {
      redirect(`/${lang}/track/${trackingId.trim()}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageSearch className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{dict.home.title}</h1>
        <p className="text-gray-500 mb-8">{dict.home.subtitle}</p>

        <form action={trackPackage} className="space-y-4">
          <input 
            name="trackingId"
            type="text" 
            placeholder={dict.home.placeholder} 
            className="w-full p-4 text-center text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all uppercase placeholder:normal-case"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            {dict.home.button}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-400">
          <Link href={`/${lang}/dashboard`} className="hover:text-gray-600">{dict.home.admin_login}</Link>
        </div>
      </div>
      
      <LanguageSwitcher currentLang={lang} />
      
      <p className="mt-6 text-xs text-gray-400">
        {dict.home.footer}
      </p>
    </div>
  );
}