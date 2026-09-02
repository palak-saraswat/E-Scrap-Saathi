'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEcoStreamTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useEcoStreamTheme();
  return (
    <Button variant="outline" size="icon" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={toggleTheme} className="rounded-xl border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}
