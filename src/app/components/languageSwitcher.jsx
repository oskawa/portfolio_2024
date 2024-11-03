"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './language.module.scss';

const LanguageSwitcher = () => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('fr'); // Set default language
  const languages = ['fr', 'en'];

  // Get the current language from the URL
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const lang = pathSegments[1]; // Get the language segment from the path
    if (languages.includes(lang)) {
      setCurrentLanguage(lang);
    }
  }, []);

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    const currentPath = window.location.pathname.split('/').slice(2).join('/'); // Exclude the locale
    router.push(`/${lang}${currentPath ? '/' + currentPath : ''}`);
  };

  return (
    <div className={styles.languageSwitcher}>
     
      <select value={currentLanguage === 'fr' ? 'Fr' : 'En'} onChange={handleLanguageChange} style={{ marginLeft: '10px' }}>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === 'fr' ? 'Fr' : 'En'}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
