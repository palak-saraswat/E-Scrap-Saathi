'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { LanguageProvider } from './language-provider';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function EcoStreamThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (
    typeof window !== 'undefined' && localStorage.getItem('eco-stream-theme') === 'dark' ? 'dark' : 'light'
  ));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('eco-stream-theme', nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      return nextTheme;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}><LanguageProvider>{children}</LanguageProvider></ThemeContext.Provider>;
}

export function useEcoStreamTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useEcoStreamTheme must be used inside EcoStreamThemeProvider');
  return context;
}
