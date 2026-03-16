// app/components/language-switcher.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher({ currentLang }: { currentLang: 'en' | 'fr' }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = (newLang: 'en' | 'fr') => {
    // 1. Drop the cookie for the middleware
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    
    // 2. Swap the locale in the URL and navigate
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
    router.refresh(); // Force server components to re-fetch dictionary
  };

  return (
    <div className="flex gap-4 items-center justify-center text-sm mt-4">
      <button 
        onClick={() => switchLang('en')} 
        className={`transition-colors ${currentLang === 'en' ? 'font-bold text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        English
      </button>
      <span className="text-gray-300">|</span>
      <button 
        onClick={() => switchLang('fr')} 
        className={`transition-colors ${currentLang === 'fr' ? 'font-bold text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        Français
      </button>
    </div>
  );
}