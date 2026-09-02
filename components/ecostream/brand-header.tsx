'use client';

import Link from 'next/link';
import { CircuitBoard, Leaf, LogIn } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useLanguage } from './language-provider';
import { BhavTicker } from '@/components/BhavTicker';

export function BrandHeader() {
  const { language, toggleLanguage } = useLanguage();
  return <header className="bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 lg:px-10"><Link href="/" className="flex items-center gap-3"><span className="relative flex h-11 w-11 items-center justify-center border-2 border-blue-900 bg-blue-50 text-blue-900"><CircuitBoard className="h-6 w-6" /><Leaf className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 p-0.5 text-white" /></span><span><span className="block text-lg font-bold tracking-tight text-blue-950">E-Scrap<span className="text-emerald-600">-Saathi</span></span><span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">सही दाम • साफ़ भविष्य</span></span></Link><nav className="flex items-center gap-2"><button type="button" onClick={toggleLanguage} className="h-9 border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-900">{language === 'en' ? 'हिंदी' : 'English'}</button><ThemeToggle /><Link href="/login" aria-label="Login" className="inline-flex h-9 items-center gap-2 bg-blue-900 px-3 text-xs font-bold text-white transition hover:bg-blue-800"><LogIn className="h-4 w-4" /><span className="hidden sm:inline">Login / लॉगिन</span></Link></nav></div><BhavTicker /></header>;
}
