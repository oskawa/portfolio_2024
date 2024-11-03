import en from '../locales/en.json';
import fr from '../locales/fr.json';

const translations = {
  en,
  fr,
};

export const translate = (key, lang) => {
  return translations[lang][key] || key; // Return the translation or the key if not found
};
