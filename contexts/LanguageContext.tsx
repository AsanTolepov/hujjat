import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, LanguageType, transliterate } from '../utils/translations';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
  tr: (text: string) => string; // Dynamic transliteration
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('uz');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as LanguageType;
    if (savedLang && ['uz', 'uz_cyr', 'kaa', 'kaa_cyr'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  // Translate static UI text
  const t = (key: string): string => {
    const translation = dictionary[key];
    if (!translation) return key;
    return translation[language] || translation['uz'];
  };

  // Transliterate dynamic text
  const tr = (text: string): string => {
    return transliterate(text, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};