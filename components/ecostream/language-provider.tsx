'use client';

import type { ReactNode } from 'react';
import { LanguageContextProvider, useLanguageContext } from '@/components/LanguageContext';

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <LanguageContextProvider>{children}</LanguageContextProvider>;
}

export function useLanguage() {
  return useLanguageContext();
}
