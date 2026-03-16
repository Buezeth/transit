// lib/dictionaries.ts
import 'server-only';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
};

// Fallback to 'en' if something weird gets passed
export const getDictionary = async (locale: 'en' | 'fr') => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.en();
};