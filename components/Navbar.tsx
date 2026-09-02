'use client';

import { CircuitBoard, Leaf, Recycle } from 'lucide-react';
import { useLanguage } from '@/components/ecostream/language-provider';

export function BrandEmblem() {
  return <span className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 shadow-lg shadow-emerald-500/25"><span className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full transition group-hover:[animation-play-state:paused]"><Recycle className="h-11 w-11 text-emerald-600" strokeWidth={1.6} /></span><span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white"><CircuitBoard className="h-4 w-4" /><Leaf className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 p-0.5" /></span></span>;
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  return <span className="flex items-center gap-3"><BrandEmblem /><span><span className="block text-lg font-bold tracking-tight text-blue-900 dark:text-white">E-Scrap<span className="text-emerald-700">-Saathi</span></span><span className="block text-sm font-semibold text-emerald-700 dark:text-emerald-400">ई-स्क्रैप साथी</span>{!compact && <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">🌿 {language === 'hi' ? 'पहचानें • मूल्यांकन करें • सत्यापित करें • रीसायकल करें' : 'Identify. Value. Verify. Recycle.'}</span>}</span></span>;
}
