'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi';
type LanguageContextValue = { language: Language; toggleLanguage: () => void };
export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => typeof window !== 'undefined' && localStorage.getItem('eco-stream-language') === 'hi' ? 'hi' : 'en');
  const toggleLanguage = () => setLanguage((current) => { const next = current === 'en' ? 'hi' : 'en'; localStorage.setItem('eco-stream-language', next); return next; });
  return <LanguageContext.Provider value={{ language, toggleLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguageContext must be used inside LanguageContextProvider');
  return context;
}
